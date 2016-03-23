using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class OfferModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public List<OfferObjectGet_Response> getOffers(decimal top, decimal bottom, decimal left, decimal right, int offer_ID = 0)
        {
            try
            {
                string[] delimiters = new string[] { "#" };
                if (offer_ID == 0)
                {
                    //return (from o in db.offers
                    //        join fd in db.fooducers on o.offer_source_fooducer_ID equals fd.fooducer_ID
                    //        join u in db.users on fd.user_ID equals u.user_ID
                    //        where o.offer_expiry > DateTime.Now && o.offer_max > o.vouchers.Count()
                    //        select new OfferObjectGet_Response
                    //        {
                    //            offer_ID = o.offer_ID,
                    //            user_ID = u.user_ID,
                    //            fooducer_ID = fd.fooducer_ID,
                    //            fooducer_username = fd.fooducer_username,
                    //            fooducer_image = fd.fooducer_image,
                    //            offer_title = o.offer_title,
                    //            offer_text = o.offer_text,
                    //            offer_image = o.offer_image,
                    //            offer_expiry = o.offer_expiry,
                    //            offer_availed = o.vouchers.Count(),
                    //            offer_max = o.offer_max,
                    //            offer_savings = o.offer_savings,
                    //            offer_claim_from = o.offer_claim_from,
                    //            offer_claim_to = o.offer_claim_to,
                    //            offer_amount = o.offer_amount
                    //        }).ToList();((Convert.ToDecimal(o.fooducer.fooducer_location_longitude) <= longitude + 1 || Convert.ToDecimal(o.fooducer.fooducer_location_longitude) >= longitude - 1) && (Convert.ToDecimal(o.fooducer.fooducer_location_latitude) <= latitude + 1 || Convert.ToDecimal(o.fooducer.fooducer_location_latitude) >= latitude - 1))

                    if (top <= 0 && right <= 0 && bottom <= 0 && left <= 0)
                    {
                        return db.offers.Where(o => o.offer_expiry > DateTime.UtcNow && o.offer_max > o.vouchers.Count())
                            .Select(o => new OfferObjectGet_Response
                            {
                                offer_ID = o.offer_ID,
                                offer_image = o.offer_image,
                                offer_title = o.offer_title,
                                offer_text = o.offer_text.Length > 140 ? o.offer_text.ToString() + "..." : o.offer_text,
                                fooducer_ID = o.fooducer.fooducer_ID,
                                fooducer_company = o.fooducer.fooducer_company,
                                fooducer_image = o.fooducer.fooducer_image,
                                fooducer_username = o.fooducer.user.user_name
                            }).ToList();
                    }
                    else
                    {

                        return db.offers.Where(o => o.offer_expiry > DateTime.UtcNow && o.offer_max > o.vouchers.Count() && ((Convert.ToDecimal(o.fooducer.fooducer_location_latitude) <= top && Convert.ToDecimal(o.fooducer.fooducer_location_latitude) >= bottom) && (Convert.ToDecimal(o.fooducer.fooducer_location_longitude) <= right && Convert.ToDecimal(o.fooducer.fooducer_location_longitude) >= left)))
                            .Select(o => new OfferObjectGet_Response
                            {
                                offer_ID = o.offer_ID,
                                offer_image = o.offer_image,
                                offer_title = o.offer_title,
                                offer_text = o.offer_text.Length > 140 ? o.offer_text.ToString() + "..." : o.offer_text,
                                fooducer_ID = o.fooducer.fooducer_ID,
                                fooducer_company = o.fooducer.fooducer_company,
                                fooducer_image = o.fooducer.fooducer_image,
                                fooducer_username = o.fooducer.user.user_name
                            }).ToList();
                    }
                }
                else
                {
                    //return (from o in db.offers
                    //        join fd in db.fooducers on o.offer_source_fooducer_ID equals fd.fooducer_ID
                    //        join u in db.users on fd.user_ID equals u.user_ID
                    //        where o.offer_expiry > DateTime.Now && o.offer_max > o.vouchers.Count() && o.offer_ID == offer_ID 
                    //        select new OfferObjectGet_Response
                    //        {
                    //            offer_ID = o.offer_ID,
                    //            user_ID = u.user_ID,
                    //            fooducer_ID = fd.fooducer_ID,
                    //            fooducer_username = fd.fooducer_username,
                    //            fooducer_image = fd.fooducer_image,
                    //            offer_text = o.offer_text,
                    //            offer_image = o.offer_image,
                    //            offer_expiry = o.offer_expiry,
                    //            offer_availed = o.vouchers.Count(),
                    //            offer_max = o.offer_max,
                    //            offer_savings = o.offer_savings,
                    //            offer_claim_from = o.offer_claim_from,
                    //            offer_claim_to = o.offer_claim_to,
                    //            offer_amount = o.offer_amount
                    //        }).ToList();

                    return db.offers.Where(o => o.offer_ID == offer_ID)
                    .Select(o => new OfferObjectGet_Response
                    {
                        offer_ID = o.offer_ID,
                        fooducer_ID = o.fooducer.fooducer_ID,
                        fooducer_company = o.fooducer.fooducer_company,
                        fooducer_image = o.fooducer.fooducer_image,
                        fooducer_username = o.fooducer.user.user_name,
                        offer_title = o.offer_title,
                        offer_text = o.offer_text,
                        offer_details = o.offer_details.Split(delimiters, StringSplitOptions.RemoveEmptyEntries).ToList<string>(),
                        offer_image = o.offer_image,
                        offer_expiry = o.offer_expiry,
                        offer_max = o.offer_max,
                        offer_availed = o.vouchers.Count(),
                        offer_savings = o.offer_savings,
                        offer_claim_from = o.offer_claim_from,
                        offer_claim_to = o.offer_claim_to,
                        offer_amount = o.offer_amount,
                        offer_isAvailable = o.offer_expiry > DateTime.UtcNow && o.offer_max > o.vouchers.Count() ? true : false,
                        availers = o.vouchers.Select(v => new availer_foodict { foodict_ID = v.voucher_owner_foodict_ID, user_name = v.foodict.user.user_name, foodict_image = v.foodict.foodict_image, voucher_code = v.foodict.foodict_first_name + " " + v.foodict.foodict_last_name }).ToList()
                    }).ToList();
                }
                

            }
            catch
            {
                return null;
            }
        }

        public OfferObjectUpdates_Response getUpdates(int offer_ID)
        {
            try
            {
                return db.offers.Where(o => o.offer_ID == offer_ID).Select(o => new OfferObjectUpdates_Response
                {
                    offer_availed = o.vouchers.Count(),
                    offer_max = o.offer_max,
                    offer_isAvailable = o.offer_expiry > DateTime.UtcNow && o.offer_max > o.vouchers.Count() ? true : false
                }).First();
                //return (from o in db.offers
                //        join fd in db.fooducers on o.offer_source_fooducer_ID equals fd.fooducer_ID
                //        join u in db.users on fd.user_ID equals u.user_ID
                //        where o.offer_expiry > DateTime.UtcNow && o.offer_max > o.vouchers.Count() && o.offer_ID == offer_ID
                //        select new OfferObjectUpdates_Response
                //        {
                //            offer_availed = o.vouchers.Count(),
                //            offer_max = o.offer_max,
                //            offer_isAvailable = true
                //        }).First();

            }
            catch 
            {
                return new OfferObjectUpdates_Response{offer_isAvailable = false};
            }
        }

        public OfferObjectPost_Response availVoucher(int offer_ID, int foodict_ID)
        {
            //check if offer is available or it exist
            if (db.offers.Any(o => o.offer_ID == offer_ID && o.offer_max > o.vouchers.Count() && o.offer_expiry > DateTime.UtcNow))
            {
                foodict f = db.foodicts.Where(fd => fd.foodict_ID == foodict_ID).First();
                offer o = db.offers.Where(of => of.offer_ID == offer_ID && of.offer_max > of.vouchers.Count() && of.offer_expiry > DateTime.UtcNow).First();

                if (f.foodict_foodie_points >= o.offer_amount)
                {
                    voucher obj = new voucher();
                    obj.voucher_code = foodict_ID + "-" + offer_ID + "-" + o.fooducer.fooducer_ID + "-" + (o.vouchers.Count() + 1);
                    obj.voucher_owner_foodict_ID = foodict_ID;
                    obj.voucher_source_offer_ID = offer_ID;
                    obj.voucher_isClaimed = false;
                    obj.voucher_isDeleted = false;
                    obj.voucher_bought_date = DateTime.UtcNow;


                    //CREATING SHARED POST
                    //post p = new post
                    //{
                    //    foodict_ID = foodict_ID,
                    //    post_type = "2",
                    //    post_availed_offer_ID = o.offer_ID,
                    //    post_image = o.offer_image,
                    //    post_date = DateTime.UtcNow,
                    //    post_title = o.offer_title,
                    //    post_nearby_establishment = o.fooducer.fooducer_username
                    //};

                    //db.posts.InsertOnSubmit(p);
                    //db.SubmitChanges();

                    db.vouchers.InsertOnSubmit(obj); // create voucher
                    db.SubmitChanges();

                    f.foodict_foodie_points = f.foodict_foodie_points - o.offer_amount; //decrease foodie points
                    db.SubmitChanges();

                    o.fooducer.fooducer_foodie_points = o.fooducer.fooducer_foodie_points + o.offer_amount; //increase fooducer foodie points
                    db.SubmitChanges();

                    return new OfferObjectPost_Response { 
                        voucher_ID = obj.voucher_ID, 
                        offer_amount = o.offer_amount, 
                        foodict_foodie_points = f.foodict_foodie_points, 
                        status = 1 
                    };
                }
                else
                {
                    return new OfferObjectPost_Response
                    {
                        voucher_ID = 0,
                        offer_amount = o.offer_amount,
                        foodict_foodie_points = f.foodict_foodie_points,
                        status = 0
                    };
                }

                
            }
            else
            {
                return new OfferObjectPost_Response
                {
                    voucher_ID = 0,
                    offer_amount = 0,
                    foodict_foodie_points = 0,
                    status = 2
                };
            }
        }
    }

    //GET WHOLE OFFER
    public class OfferObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<OfferObjectGet_Response> result { get; set; }
    }
    public class OfferObjectGet_Response
    {
        public int offer_ID { get; set; }
        public int user_ID { get; set; }
        public int fooducer_ID { get; set; }
        public string fooducer_username { get; set; }
        public string fooducer_company { get; set; }
        public string fooducer_image { get; set; }
        public string offer_title { get; set; }
        public List<string> offer_details { get; set; }
        public string offer_text { get; set; }
        public string offer_image { get; set; }
        public int offer_amount { get; set; }
        public string offer_savings { get; set; }
        public int? offer_availed { get; set; }
        public int? offer_max { get; set; }
        public DateTime? offer_expiry { get; set; }
        public DateTime? offer_claim_from { get; set; }
        public DateTime? offer_claim_to { get; set; }
        public List<availer_foodict> availers { get; set; }
        public bool offer_isAvailable { get; set; }
    }

    //GET OFFER UPDATES
    public class OfferObjectUpdates_Response
    {
        public int? offer_availed { get; set; }
        public int? offer_max { get; set; }
        public bool offer_isAvailable { get; set; }
    }

    //POST - buy voucher
    public class OfferObjectPost_Request
    {
        public string api_key  { get; set; }
        public int foodict_ID { get; set; }
        public int offer_ID { get; set; }
    }
    public class OfferObjectPost_Response
    {
        public int voucher_ID { get; set; }
        public int offer_amount { get; set; }
        public int? foodict_foodie_points { get; set; }
        public int status { get; set; } // 0 = insufficient, 1 = success, 2 = expired offer 
    }
    public class OfferObjectPost_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public OfferObjectPost_Response result { get; set; }
    }
}