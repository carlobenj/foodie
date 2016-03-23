using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class ValidateModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public List<ValidateObjectGet_Response> getValidateTiles(int fooducer_ID)
        {
            try
            {
                return db.offers.Where(o => o.offer_source_fooducer_ID == fooducer_ID && o.offer_claim_from <= DateTime.UtcNow && o.offer_claim_to >= DateTime.UtcNow).OrderByDescending(o => o.offer_expiry).Select(o => new ValidateObjectGet_Response
                {
                    offer_ID = o.offer_ID,
                    offer_image = o.offer_image,
                    offer_title = o.offer_title,
                    offer_unclaimedCount = o.vouchers.Where(v => v.voucher_isClaimed == false).Count()
                }).ToList();
            }
            catch
            {
                return null;
            }
        }

        public ValidateObjectPost_Response getPromo(int fooducer_ID, int offer_ID)
        {
            try
            {
                string[] delimiters = new string[] { "#" };
                return db.offers.Where(o => o.offer_ID == offer_ID && o.offer_source_fooducer_ID == fooducer_ID)
                    .Select(o => new ValidateObjectPost_Response
                    {
                        offer_ID = o.offer_ID,
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
                        availers = o.vouchers.Select(v => new availer_foodict { foodict_ID = v.voucher_owner_foodict_ID, user_name = v.foodict.user.user_name, foodict_image = v.foodict.foodict_image, isClaimed = v.voucher_isClaimed, voucher_bought_date = v.voucher_bought_date, voucher_claim_date = v.voucher_claim_date, voucher_code = v.voucher_code }).ToList()
                    }).First();
            }
            catch 
            {
                return null;
            }
        }

        public ValidateObjectPut_Response validateCode(int offer_ID, int fooducer_ID, string voucher_code)
        {
            try
            {
                //VOUCHER CODE: [voucher_ID] - [foodict_ID] - [foodict_ID] - [offer_ID] - [fooducer_ID] - [voucher_counter]
                string[] delimiters = new string[] { "-" };
                List<string> individual_code = voucher_code.Split(delimiters, StringSplitOptions.RemoveEmptyEntries).ToList<string>();

                ValidateObjectPut_Response result = db.foodicts.Where(f => f.foodict_ID == Convert.ToInt32(individual_code[1])).Select(f => new ValidateObjectPut_Response
                {
                    foodict_ID = f.foodict_ID,
                    foodict_image = f.foodict_image,
                    user_name = f.user.user_name,
                    voucher_string = individual_code[2] + "-" + individual_code[3] + "-" + individual_code[4] + "-" + individual_code[5]
                }).First();

                if (individual_code.Count() == 6)
                {
                    if (db.vouchers.Any(vc => vc.voucher_ID == Convert.ToInt32(individual_code[0]) && vc.voucher_owner_foodict_ID == Convert.ToInt32(individual_code[1]) && vc.offer.fooducer.fooducer_ID == fooducer_ID && vc.offer.offer_ID == offer_ID && vc.offer.offer_claim_to > DateTime.UtcNow && vc.voucher_isClaimed == false))
                    {
                        voucher v = db.vouchers.Where(vc => vc.voucher_ID == Convert.ToInt32(individual_code[0]) && vc.voucher_owner_foodict_ID == Convert.ToInt32(individual_code[1]) && vc.offer.fooducer.fooducer_ID == fooducer_ID && vc.offer.offer_ID == offer_ID && vc.offer.offer_claim_to > DateTime.UtcNow && vc.voucher_isClaimed == false).First();
                        v.voucher_isClaimed = true;
                        v.voucher_claim_date = DateTime.UtcNow;
                        db.SubmitChanges();

                        /*RESULT: Okay*/
                        result.status = 1;
                    }
                    else if (individual_code[1] != individual_code[2])
                    {
                        /*RESULT: Tampered voucher*/
                        result.status = 3;
                    }
                    else if (individual_code[4] != fooducer_ID.ToString())
                    {
                        /*RESULT: Wrong Establishment*/
                        result.status = 4;
                    }
                    else if (individual_code[3] != offer_ID.ToString())
                    {
                        /*RESULT: Wrong Offer*/
                        result.status = 5;
                    }
                    else if (!db.vouchers.Any(v => v.offer.offer_claim_to > DateTime.UtcNow && v.offer.offer_ID == Convert.ToInt32(individual_code[3])))
                    {
                        /*RESULT: Expired coupon*/
                        result.status = 6;
                    }
                    else if (!db.vouchers.Any(v => v.voucher_isClaimed == false && v.offer.offer_ID == Convert.ToInt32(individual_code[3])))
                    {
                        /*RESULT: Claimed coupon*/
                        result.status = 7;
                    }
                    else
                    {
                        /*RESULT: Unknown status*/
                        result.status = 8;
                    }
                }
                else
                {
                    /*RESULT: Malformed voucher code*/
                    result.status = 2;
                }

                return result;
            }
            catch
            {
                return null;
            }
            
        }
    }

    /*GET*/
    public class ValidateObjectGet_Response
    {
        public int offer_ID { get; set; }
        public string offer_image { get; set; }
        public string offer_title { get; set; }
        public int offer_unclaimedCount { get; set; }
    }

    public class ValidateObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<ValidateObjectGet_Response> result { get; set; }
    }

    /*POST*/
    public class ValidateObjectPost_Request
    {
        public string api_key { get; set; }
        public int fooducer_ID { get; set; }
        public int offer_ID { get; set; }
    }
    public class ValidateObjectPost_Response
    {
        public int offer_ID { get; set; }
        public string offer_title { get; set; }
        public string offer_text { get; set; }
        public List<string> offer_details { get; set; }
        public string offer_image { get; set; }
        public DateTime? offer_expiry { get; set; }
        public int? offer_max { get; set; }
        public int offer_availed { get; set; }
        public string offer_savings { get; set; }
        public DateTime? offer_claim_from { get; set; }
        public DateTime? offer_claim_to { get; set; }
        public int offer_amount { get; set; }
        public bool offer_isAvailable { get; set; }
        public List<availer_foodict> availers { get; set; }
    }
    public class ValidateObjectPost_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public ValidateObjectPost_Response result { get; set; }
    }

    /*PUT*/

    public class ValidateObjectPut_Request
    {
        public string api_key { get; set; }
        public int fooducer_ID { get; set; }
        public int offer_ID { get; set; }
        public string voucher_code { get; set; }
    }
    public class ValidateObjectPut_Response
    {
        public int foodict_ID { get; set; }
        public string voucher_string { get; set; }
        public string foodict_image { get; set; }
        public string user_name { get; set; }
        public int status { get; set; }
    }
    public class ValidateObjectPut_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public ValidateObjectPut_Response result { get; set; }
    }
}