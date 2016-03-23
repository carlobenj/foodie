using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class DashboardModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public DashboardObjectGet_Response getMyDashboard(int fooducer_ID)
        {
            try
            {
                DashboardObjectGet_Response response = (from f in db.fooducers
                                                        where f.fooducer_ID == fooducer_ID
                                                        select new DashboardObjectGet_Response
                                                        {
                                                            user_ID = f.user_ID,
                                                            fooducer_ID = f.fooducer_ID,
                                                            fooducer_foodie_points = f.fooducer_foodie_points ?? 0,
                                                            fooducer_username = f.fooducer_username,
                                                            fooducer_company = f.fooducer_company,
                                                            fooducer_offer_active = f.offers.Where(o => o.offer_expiry > DateTime.Now).Count(),
                                                            fooducer_offer_expired = f.offers.Where(o => o.offer_expiry < DateTime.Now).Count(),
                                                            fooducer_total_voucher_released = f.offers.Select(o => o.offer_max).Sum() ?? 0,
                                                            fooducer_active_voucher_released = f.offers.Where(o => o.offer_expiry > DateTime.Now).Select(o => o.offer_max).Sum() ?? 0
                                                        }).First();

                var voucherobject = db.vouchers.Where(v => v.offer.offer_source_fooducer_ID == fooducer_ID);

                //ACTIVE VOUCHERS
                response.fooducer_active_voucher_bought = voucherobject.Where(v => v.offer.offer_expiry > DateTime.Now).Count();
                response.fooducer_active_voucher_claimed = voucherobject.Where(v => v.voucher_isClaimed == true && v.offer.offer_expiry > DateTime.Now).Count();

                //OVERALL VOUCHERS
                response.fooducer_total_voucher_bought = voucherobject.Count();
                response.fooducer_total_voucher_claimed = voucherobject.Where(v => v.voucher_isClaimed == true).Count();
                

                //SEED
                response.fooducer_promotion_seed = db.fooducers.OrderByDescending(f => f.fooducer_foodie_points).ToList<fooducer>().FindIndex(f => f.fooducer_ID == fooducer_ID) + 1;
                //View
                //List<DateTime> tempDates = db.views.Where(v => v.view_date >= DateTime.UtcNow.AddDays(-3) && v.view_date <= DateTime.UtcNow.AddDays(3)).Select(v => v.view_date.Date).Distinct().ToList();
                List<view_point> lvp = new List<view_point>();
                for (int x = -6; x <= 0; x++)
                {
                    view_point vp = new view_point()
                    {
                        pointDate = DateTime.UtcNow.AddDays(x),
                        allFoodicts = db.views.Where(vd => vd.view_date == DateTime.UtcNow.AddDays(x)).Select(vd => new foodict_view
                        {
                            foodict_ID = vd.view_source_foodict_ID,
                            view_date = vd.view_date
                        }).ToList()
                    };
                    lvp.Add(vp);
                }
                response.view_data = lvp;

                //FINAL
                //response.view_data = db.views.Where(v => v.view_date >= DateTime.UtcNow.AddDays(-3) && v.view_date <= DateTime.UtcNow.AddDays(3)).GroupBy(v => v.view_date.Date).Select(v => new view_point
                //{
                //    pointDate = v.Key,
                //    allFoodicts = v.Select(vd => new foodict_view
                //    {
                //        foodict_ID = vd.view_source_foodict_ID,
                //        view_date = vd.view_date,
                //        view_time = vd.view_time.TotalHours
                //    }).ToList()
                //}).ToList();
                return response;
            }
            catch 
            {
                return null;
            }            
        }
    }

    //GET
    public class DashboardObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public DashboardObjectGet_Response result { get; set; }

    }
    public class DashboardObjectGet_Response
    {
        public int user_ID { get; set; }
        public int fooducer_ID { get; set; }

        public int? fooducer_foodie_points { get; set; }
        public string fooducer_username { get; set; }
        public string fooducer_company { get; set; }

        public int? fooducer_active_voucher_released { get; set; }
        public int fooducer_active_voucher_bought { get; set; }
        public int fooducer_active_voucher_claimed { get; set; }

        public int? fooducer_total_voucher_released { get; set; }
        public int fooducer_total_voucher_bought { get; set; }
        public int fooducer_total_voucher_claimed { get; set; }

        public int fooducer_promotion_seed { get; set; }
        public int fooducer_offer_active { get; set; }
        public int fooducer_offer_expired { get; set; }

        /*DASH REINVENT*/
        public List<view_point> view_data { get; set; }
    }

    public class view_point
    {
        public DateTime pointDate { get; set; }
        public List<foodict_view> allFoodicts { get; set; }
    }

    public class foodict_view
    {
        public int foodict_ID { get; set; }
        public DateTime view_date { get; set; }
        public double view_time { get; set; }
    }
}