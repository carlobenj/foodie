using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class VoucherModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public VoucherObjectGet_Response getMyVouchers(int foodict_ID)
        {
            try
            {
                VoucherObjectGet_Response obj = new VoucherObjectGet_Response();
                obj.voucher_available = (from v in db.vouchers
                                         where v.voucher_owner_foodict_ID == foodict_ID && v.voucher_isClaimed == false && v.offer.offer_claim_to > DateTime.Now && v.voucher_isDeleted == false
                                         select new VoucherObjectGet_ResponseItem
                                         {
                                             voucher_ID = v.voucher_ID,
                                             voucher_code = v.voucher_code,
                                             voucher_isClaimed = v.voucher_isClaimed,
                                             voucher_source_offer_ID = v.offer.offer_ID,
                                             voucher_claim_date = v.voucher_claim_date,
                                             offer_ID = v.offer.offer_ID,
                                             offer_image = v.offer.offer_image,
                                             offer_title = v.offer.offer_title,
                                             offer_text = v.offer.offer_text,
                                             offer_claim_from = v.offer.offer_claim_from,
                                             offer_claim_to = v.offer.offer_claim_to,
                                             fooducer_ID = v.offer.fooducer.fooducer_ID,
                                             fooducer_username = v.offer.fooducer.fooducer_username,
                                             fooducer_company = v.offer.fooducer.fooducer_company,
                                             fooducer_image = v.offer.fooducer.fooducer_image
                                         }).ToList();
                obj.voucher_expired = (from v in db.vouchers
                                       where v.voucher_owner_foodict_ID == foodict_ID && v.voucher_isClaimed == false && v.offer.offer_claim_to < DateTime.Now && v.voucher_isDeleted == false
                                       select new VoucherObjectGet_ResponseItem
                                       {
                                           voucher_ID = v.voucher_ID,
                                           voucher_code = v.voucher_code,
                                           voucher_isClaimed = v.voucher_isClaimed,
                                           voucher_source_offer_ID = v.offer.offer_ID,
                                           voucher_claim_date = v.voucher_claim_date,
                                           offer_ID = v.offer.offer_ID,
                                           offer_image = v.offer.offer_image,
                                           offer_title = v.offer.offer_title,
                                           offer_text = v.offer.offer_text,
                                           offer_claim_from = v.offer.offer_claim_from,
                                           offer_claim_to = v.offer.offer_claim_to,
                                           fooducer_ID = v.offer.fooducer.fooducer_ID,
                                           fooducer_username = v.offer.fooducer.fooducer_username,
                                           fooducer_company = v.offer.fooducer.fooducer_company,
                                           fooducer_image = v.offer.fooducer.fooducer_image
                                       }).ToList();
                obj.voucher_claimed = (from v in db.vouchers
                                       where v.voucher_owner_foodict_ID == foodict_ID && v.voucher_isClaimed == true && v.voucher_isDeleted == false
                                       select new VoucherObjectGet_ResponseItem
                                       {
                                           voucher_ID = v.voucher_ID,
                                           voucher_code = v.voucher_code,
                                           voucher_isClaimed = v.voucher_isClaimed,
                                           voucher_source_offer_ID = v.offer.offer_ID,
                                           voucher_claim_date = v.voucher_claim_date,
                                           offer_ID = v.offer.offer_ID,
                                           offer_image = v.offer.offer_image,
                                           offer_title = v.offer.offer_title,
                                           offer_text = v.offer.offer_text,
                                           offer_claim_from = v.offer.offer_claim_from,
                                           offer_claim_to = v.offer.offer_claim_to,
                                           fooducer_ID = v.offer.fooducer.fooducer_ID,
                                           fooducer_username = v.offer.fooducer.fooducer_username,
                                           fooducer_company = v.offer.fooducer.fooducer_company,
                                           fooducer_image = v.offer.fooducer.fooducer_image
                                       }).ToList();
                return obj;
            }
            catch
            {
                return null;
            }            
        }

        public bool deleteVoucher(int foodict_ID, int voucher_ID)
        {
            try
            {
                voucher v = db.vouchers.Where(d => d.voucher_owner_foodict_ID == foodict_ID && d.voucher_ID == voucher_ID && d.voucher_isClaimed == false).First();
                v.voucher_isDeleted = true;
                db.SubmitChanges();

                return true;
            }
            catch 
            {
                return false;
            }
        }
    }


    //GET ALL VOUCHERS
    public class VoucherObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public VoucherObjectGet_Response result { get; set; }
    }
    public class VoucherObjectGet_Response
    {
        public List<VoucherObjectGet_ResponseItem> voucher_available { get; set; }
        public List<VoucherObjectGet_ResponseItem> voucher_expired { get; set; }
        public List<VoucherObjectGet_ResponseItem> voucher_claimed { get; set; }
    }
    public class VoucherObjectGet_ResponseItem
    {
        public int voucher_ID { get; set; }
        public string voucher_code { get; set; }
        public bool? voucher_isClaimed { get; set; }
        public DateTime? voucher_claim_date { get; set; }
        public int offer_ID { get; set; }
        public string offer_image { get; set; }
        public string offer_title { get; set; }
        public string offer_text { get; set; }
        public DateTime? offer_claim_from { get; set; }
        public DateTime? offer_claim_to { get; set; }
        public int fooducer_ID { get; set; }
        public string fooducer_username { get; set; }
        public string fooducer_company { get; set; }
        public string fooducer_image { get; set; }
        public int voucher_source_offer_ID { get; set; }
    }

    //DELETE VOUCHER
    public class VoucherObjectDelete_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}