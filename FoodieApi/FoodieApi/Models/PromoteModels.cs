using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class PromoteModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public List<PromoteObjectGet_Response> getMyPromotion(int fooducer_ID, bool isActive) 
        {

            string[] delimiters = new string[] { "#" };
            try
            {
                if (isActive)
                {
                    return db.offers.Where(o => o.offer_source_fooducer_ID == fooducer_ID && o.offer_expiry > DateTime.UtcNow && o.offer_max > o.vouchers.Count())
                    .Select(o => new PromoteObjectGet_Response
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
                        availers = o.vouchers.Select(v => new availer_foodict { foodict_ID = v.voucher_owner_foodict_ID, user_name = v.foodict.user.user_name, foodict_image = v.foodict.foodict_image, isClaimed = v.voucher_isClaimed, voucher_bought_date = v.voucher_bought_date, voucher_claim_date = v.voucher_claim_date, voucher_code = v.voucher_code }).ToList()
                    }).ToList();
                }
                else
                {

                    return db.offers.Where(o => o.offer_source_fooducer_ID == fooducer_ID)
                    .Select(o => new PromoteObjectGet_Response
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
                        availers = o.vouchers.Select(v => new availer_foodict { foodict_ID = v.voucher_owner_foodict_ID, user_name = v.foodict.user.user_name, foodict_image = v.foodict.foodict_image, isClaimed = v.voucher_isClaimed, voucher_bought_date = v.voucher_bought_date, voucher_claim_date = v.voucher_claim_date, voucher_code = v.voucher_code }).ToList()
                    }).ToList<PromoteObjectGet_Response>();
                }
                
            }
            catch
            {
                return null;
            }            
        }

        public bool createPromo(PromoteObjectPost_Insert obj)
        {
            try
            {

                //dismiss all hanging offers incase
                List<offer> to_dismiss = db.offers.Where(o => o.offer_source_fooducer_ID == obj.fooducer_ID && o.offer_expiry > DateTime.UtcNow).ToList();
                foreach (offer itm in to_dismiss)
                {
                    itm.offer_expiry = DateTime.UtcNow;
                    db.SubmitChanges();
                }

                //start inserting
                offer of = new offer()
                {
                    offer_source_fooducer_ID = obj.fooducer_ID,
                    offer_title = obj.offer_title,
                    offer_text = obj.offer_text,
                    offer_details = obj.offer_details,
                    offer_savings = obj.offer_savings,
                    offer_max = obj.offer_max,
                    offer_amount = obj.offer_amount,
                    offer_claim_from = obj.offer_claim_from,
                    offer_claim_to = obj.offer_claim_to,
                    offer_expiry = DateTime.UtcNow.AddDays(5),
                    offer_post_date = DateTime.UtcNow
                };
                db.offers.InsertOnSubmit(of);
                db.SubmitChanges();

                //azure upload
                string uri = fts.foodieAzureStorageUpload(obj.offer_image, of.offer_ID.ToString(), "offers");
                if (uri != null)
                {
                    //naupload ung image kaya iuupdate ung uri sa DB
                    of.offer_image = uri;
                    db.SubmitChanges();
                    return true;
                }
                else
                {
                    //hindi naupload ung image so idedelete ung post sa DB
                    db.offers.DeleteOnSubmit(of);
                    db.SubmitChanges();
                    return false;
                }
            }
            catch 
            {
                return false;
            }
            
        }

        public bool endPromo(int fooducer_ID)
        {
            try
            {
                offer obj = db.offers.Where(o => o.offer_source_fooducer_ID == fooducer_ID && o.offer_expiry > DateTime.UtcNow && o.offer_max > o.vouchers.Count()).First();
                obj.offer_expiry = DateTime.UtcNow;
                db.SubmitChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }


    /*GET*/
    public class PromoteObjectGet_Response
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
        public List<availer_foodict> availers { get; set; }
    }

    public class availer_foodict
    {
        public int foodict_ID { get; set; }
        public string foodict_image { get; set; }
        public DateTime? voucher_bought_date { get; set; }
        public DateTime? voucher_claim_date { get; set; }
        public string user_name { get; set; }
        public bool? isClaimed { get; set; }
        public string voucher_code { get; set; }
    }

    public class PromoteObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<PromoteObjectGet_Response> result { get; set; }
    }

    /*POST*/
    public class PromoteObjectPost_Insert
    {
        public string api_key { get; set; }
        public int fooducer_ID { get; set; }
        public string offer_image { get; set; }
        public string offer_title { get; set; }
        public string offer_text { get; set; }
        public string offer_details { get; set; }
        public string offer_savings { get; set; }
        public int? offer_max { get; set; }
        public int offer_amount { get; set; }
        public DateTime offer_claim_from { get; set; }
        public DateTime offer_claim_to { get; set; }
    }

    public class PromoteObjectPost_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }

    /*PUT*/

    public class PromoteObjectPut_Request
    {
        public string api_key { get; set; }
        public int fooducer_ID { get; set; }
    }

    public class PromoteObjectPut_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}