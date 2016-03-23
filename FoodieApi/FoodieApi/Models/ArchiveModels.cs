using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class ArchiveModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public List<ArchiveObjectGet_Response> getArchives(int fooducer_ID)
        {
            try
            {
                return db.offers.Where(o => o.fooducer.fooducer_ID == fooducer_ID && (o.offer_expiry < DateTime.UtcNow || o.offer_max <= o.vouchers.Count()))
                    .OrderByDescending(o => o.offer_expiry)
                    .Select(o => new ArchiveObjectGet_Response
                    {
                        offer_ID = o.offer_ID,
                        offer_title = o.offer_title,
                        offer_image = o.offer_image,
                        offer_expiry = o.offer_expiry,
                        offer_text = o.offer_text,
                        totalClaimedCount = o.vouchers.Where(v => v.voucher_isClaimed == true).Count(),
                        totalBoughtCount = o.vouchers.Count(),
                        foodiePointsEarned = o.vouchers.Where(v => v.voucher_isClaimed == true).Count() * o.offer_amount
                    }).ToList<ArchiveObjectGet_Response>();
            }
            catch
            {
                return null;
            }
        }

        public ArchiveObjectPost_Response getArchiveDetails(int offer_ID, int fooducer_ID)
        {
            try
            {
                /////////////////////////////////////////// FOR CHART /////////////////////////////////////////// 
                ArchiveObjectPost_Response result = db.offers.Where(o => o.offer_ID == offer_ID && o.fooducer.fooducer_ID == fooducer_ID && (o.offer_expiry < DateTime.UtcNow || o.offer_max <= o.vouchers.Count()))
                    .Select(o => new ArchiveObjectPost_Response
                    {
                        offer_ID = o.offer_ID,
                        offer_title = o.offer_title,
                        offer_image = o.offer_image,
                        offer_expiry = o.offer_expiry,
                        offer_text = o.offer_text,
                        offer_post_date = o.offer_post_date,
                        offer_claim_from = o.offer_claim_from,
                        offer_claim_to = o.offer_claim_to,
                        totalClaimedCount = o.vouchers.Where(v => v.voucher_isClaimed == true).Count(),
                        totalBoughtCount = o.vouchers.Count(),
                        foodiePointsEarned = o.vouchers.Where(v => v.voucher_isClaimed == true).Count() * o.offer_amount,
                        claimingIsDone = DateTime.UtcNow > o.offer_claim_to ? true : false,
                    }).First();

                List<DateTime?> distinct_bought_dates = db.vouchers.Where(v => v.offer.offer_ID == offer_ID).Select(v => v.voucher_bought_date).Distinct().ToList();
                List<DateTime?> distinct_claim_dates = db.vouchers.Where(v => v.offer.offer_ID == offer_ID && v.voucher_isClaimed == true).Select(v => v.voucher_claim_date).Distinct().ToList();
                List<pointTrack> tmpPoints = new List<pointTrack>();

                //DateTime posted_date = db.offers.Where(o => o.offer_ID == offer_ID).Select(o => o.offer_post_date).First();
                //DateTime claim_start_date = db.offers.Where(o => o.offer_ID == offer_ID).Select(o => o.offer_claim_from).First();
                //DateTime claim_end_date = db.offers.Where(o => o.offer_ID == offer_ID).Select(o => o.offer_claim_to).First();
                
                int pointCounter = DateTime.UtcNow > result.offer_claim_to ? Convert.ToInt32(Math.Round((result.offer_claim_to - result.offer_claim_from).TotalDays)) : Convert.ToInt32(Math.Round((DateTime.UtcNow - result.offer_claim_from).TotalDays));
                int date_interval;
                if (pointCounter <= 5)
                {
                    //kapag di abot ng anim ung araw na pagitan
                    date_interval = 1;
                }
                else
                {
                    date_interval = DateTime.UtcNow > result.offer_claim_to ? Convert.ToInt32(Math.Round((result.offer_claim_to - result.offer_claim_from).TotalDays / 6)) : 1;
                    pointCounter = 6;
                }

                //first point: Date when you posted it. expected to have no claim count
                tmpPoints.Add(new pointTrack
                {
                    pointDate = result.offer_post_date,
                    boughtCount = db.vouchers.Where(v => v.offer.offer_ID == offer_ID && v.voucher_bought_date <= result.offer_post_date).Count(),
                    claimCount = db.vouchers.Where(v => v.offer.offer_ID == offer_ID && v.voucher_claim_date <= result.offer_post_date && v.voucher_isClaimed == true).Count()
                });

                //0 = 0, 1 = 2, 2 = 4, 3 = 6, 4 = 8, 5 = 10, 6 = 12 ::::: algo
                //claim start date to end date
                for (int x = 0; x < pointCounter; x++)
                {
                    tmpPoints.Add(new pointTrack
                    {
                        pointDate = result.offer_claim_from.AddDays(x * date_interval),
                        boughtCount = db.vouchers.Where(v => v.offer.offer_ID == offer_ID && v.voucher_bought_date <= result.offer_claim_from.AddDays(x * date_interval)).Count(),
                        claimCount = db.vouchers.Where(v => v.offer.offer_ID == offer_ID && v.voucher_claim_date <= result.offer_claim_from.AddDays(x * date_interval) && v.voucher_isClaimed == true).Count()
                    });
                }

                //final point-- nagbabago kapag di pa tapos ung claiming
                tmpPoints.Add(new pointTrack
                {
                    pointDate = DateTime.UtcNow > result.offer_claim_to ? result.offer_claim_to : DateTime.UtcNow,
                    boughtCount = db.vouchers.Where(v => v.offer.offer_ID == offer_ID).Count(),
                    claimCount = db.vouchers.Where(v => v.offer.offer_ID == offer_ID && v.voucher_isClaimed == true).Count()
                });

                result.claim_bought_track = tmpPoints;




                /////////////////////////////////////////// PER TRANSACTION /////////////////////////////////////////// 
                List<perTransaction> tempHistory = db.vouchers.Where(v => v.offer.offer_ID == offer_ID)
                                                    .Select(v => new perTransaction{
                                                        transaction_date = v.voucher_bought_date,
                                                        foodict_ID = v.foodict.foodict_ID,
                                                        foodict_image = v.foodict.foodict_image,
                                                        user_name = v.foodict.user.user_name,
                                                        type = 0
                                                    }).ToList();
                tempHistory.AddRange(db.vouchers.Where(v => v.offer.offer_ID == offer_ID && v.voucher_isClaimed == true)
                                                    .Select(v => new perTransaction{
                                                        transaction_date = v.voucher_claim_date,
                                                        foodict_ID = v.foodict.foodict_ID,
                                                        foodict_image = v.foodict.foodict_image,
                                                        user_name = v.foodict.user.user_name,
                                                        type = 1
                                                    }).ToList());
                tempHistory.OrderBy(v => v.transaction_date);

                result.transactionHistory = tempHistory;
                return result;
            }
            catch(Exception ex)
            {
                return new ArchiveObjectPost_Response { offer_title = ex.Message};
            }
        }


    }

    /*GET*/
    public class ArchiveObjectGet_Response
    {
        public int offer_ID { get; set; }
        public string offer_title { get; set; }
        public string offer_text { get; set; }
        public string offer_image { get; set; }
        public DateTime? offer_post_date { get; set; }
        public DateTime? offer_expiry { get; set; }
        public int foodiePointsEarned { get; set; }
        public int totalClaimedCount { get; set; }
        public int totalBoughtCount { get; set; }
    }

    public class ArchiveObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<ArchiveObjectGet_Response> result { get; set; }
    }

    /*POST*/
    public class ArchiveObjectPost_Request
    {
        public string api_key { get; set; }
        public int offer_ID { get; set; }
        public int fooducer_ID { get; set; }
    }

    public class ArchiveObjectPost_Response
    {
        public int offer_ID { get; set; }
        public string offer_title { get; set; }
        public string offer_text { get; set; }
        public string offer_image { get; set; }
        public DateTime offer_post_date { get; set; }
        public DateTime? offer_expiry { get; set; }
        public DateTime offer_claim_from { get; set; }
        public DateTime offer_claim_to { get; set; }
        public int totalClaimedCount { get; set; }
        public int totalBoughtCount { get; set; }
        public int foodiePointsEarned { get; set; }
        public List<pointTrack> claim_bought_track { get; set; }
        public List<perTransaction> transactionHistory { get; set; }
        public bool claimingIsDone { get; set; }
    }

    public class ArchiveObjectPost_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public ArchiveObjectPost_Response result { get; set; }
    }

    public class pointTrack
    {
        public DateTime pointDate { get; set; }
        public int claimCount { get; set; }
        public int boughtCount { get; set; }
    }

    public class perTransaction
    {
        public DateTime? transaction_date { get; set; }
        public int foodict_ID { get; set; }
        public string foodict_image { get; set; }
        public string user_name { get; set; }
        public int type { get; set; }
    }
}