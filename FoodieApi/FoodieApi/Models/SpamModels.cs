using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class SpamModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public List<SpamObjectGet_Response> getSpams() 
        {
            try
            {
                List<int?> spam_post_ID = db.reports.Where(r => r.report_type == 0).Select(r => r.report_source_item_ID).Distinct().ToList();
                List<int?> spam_comment_ID = db.reports.Where(r => r.report_type == 10).Select(r => r.report_source_item_ID).Distinct().ToList();
                
                List<SpamObjectGet_Response> result = new List<SpamObjectGet_Response>();
                foreach (int id in spam_post_ID)
                {
                    if (db.posts.Any(p => p.post_ID == id))
                    {
                        result.Add(
                            db.reports.Where(r => r.report_source_item_ID == id && r.report_type == 0).Select(r => new SpamObjectGet_Response
                            {
                                report_ID = r.report_ID,
                                report_type = r.report_type,
                                foodict_username = r.user.user_name,
                                foodict_image = r.user.foodicts.Where(f => f.user_ID == r.report_source_user_ID).Select(f => f.foodict_image).First(),
                                report_item_image = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.post_image).First(),
                                post_title = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.post_title).First(),
                                report_date = r.report_date,
                                report_description = r.report_description,
                                report_source_user_ID = r.report_source_user_ID,
                                report_source_item_ID = r.report_source_item_ID,
                                report_isDone = r.report_isDone,
                                otherReportersCount = db.reports.Where(rp => rp.report_source_item_ID == r.report_source_item_ID && rp.report_type == 0 && rp.report_source_user_ID != r.report_source_user_ID).Select(rp => rp.report_source_user_ID).Distinct().Count()
                            }).First());
                    }
                    else
                    {
                        report r = db.reports.Where(rp => rp.report_source_item_ID == id && rp.report_type == 0).First();
                        db.reports.DeleteOnSubmit(r);
                        db.SubmitChanges();
                    }
                    
                }
                foreach (int id in spam_comment_ID)
                {
                    if (db.comments.Any(c => c.comment_ID == id))
                    {
                        result.Add(
                        db.reports.Where(r => r.report_source_item_ID == id && r.report_type == 10).Select(r => new SpamObjectGet_Response
                        {
                            report_ID = r.report_ID,
                            report_type = r.report_type,
                            report_date = r.report_date,
                            foodict_username = r.user.user_name,
                            foodict_image = r.user.foodicts.Where(f => f.user_ID == r.report_source_user_ID).Select(f => f.foodict_image).First(),
                            comment_content = db.comments.Where(c => c.comment_ID == id).Select(c => c.comment_content).First(),

                            report_description = r.report_description,
                            report_source_user_ID = r.report_source_user_ID,
                            report_source_item_ID = r.report_source_item_ID,
                            report_isDone = r.report_isDone,

                            otherReportersCount = db.reports.Where(rp => rp.report_source_item_ID == r.report_source_item_ID && rp.report_type == 10 && rp.report_source_user_ID != r.report_source_user_ID).Select(rp => rp.report_source_user_ID).Distinct().Count()
                        }).First());
                    }
                    else
                    {
                        report r = db.reports.Where(rp => rp.report_source_item_ID == id && rp.report_type == 10).First();
                        db.reports.DeleteOnSubmit(r);
                        db.SubmitChanges();
                    }
                    
                }

                return result.OrderByDescending(r => r.report_ID).ToList();
            }
            catch
            {
                return null;
            }
        }

        public SpamObjectPost_Response getReport(int report_ID, int type)
        {
            try
            {
                int? focus = db.reports.Where(r => r.report_ID == report_ID).Select(r => r.report_source_item_ID).First();
                //other reporters
                List<reporter> others = db.reports.Where(r => r.report_source_item_ID == focus && r.report_type == type).Select(r => new reporter
                {
                    user_ID = r.user.user_ID,
                    foodict_ID = db.foodicts.Where(f => f.user.user_ID == r.report_source_user_ID).Select(f => f.foodict_ID).First(),
                    foodict_image = db.foodicts.Where(f => f.user.user_ID == r.report_source_user_ID).Select(f => f.foodict_image).First(),
                    foodict_username = r.user.user_name,
                    report_date = r.report_date

                }).ToList();


                switch (type)
                {
                    case 0:
                        //spam post
                        return db.reports.Where(r => r.report_ID == report_ID).Select(r => new SpamObjectPost_Response
                        {
                            report_ID = r.report_ID,
                            report_type = r.report_type,
                            foodict_username = db.posts.Where(c => c.post_ID == r.report_source_item_ID).Select(c => c.foodict.user.user_name).First(),
                            foodict_image = db.posts.Where(c => c.post_ID == r.report_source_item_ID).Select(c => c.foodict.foodict_image).First(),
                            report_item_image = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.post_image).First(),
                            post_title = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.post_title).First(),
                            post_image = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.post_image).First(),
                            post_text = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.post_text).First(),
                            post_date = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.post_date).First(),
                            bitesCount = db.posts.Where(p => p.post_ID == r.report_source_item_ID).Select(p => p.bites.Count()).First(),

                            report_date = r.report_date,
                            report_description = r.report_description,
                            report_source_user_ID = r.report_source_user_ID,
                            report_source_item_ID = r.report_source_item_ID,
                            report_isDone = r.report_isDone,
                            reporters = others
                        }).First();
                    case 1:
                        return null;
                    case 10:
                        //spam comment
                        return db.reports.Where(r => r.report_ID == report_ID).Select(r => new SpamObjectPost_Response
                        {
                            report_ID = r.report_ID,
                            report_type = r.report_type,
                            report_date = r.report_date,
                            comment_content = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.comment_content).First(),
                            comment_date = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.comment_date).First(),
                            foodict_username = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.foodict.user.user_name).First(),
                            foodict_image = db.comments.Where(c => c.comment_ID == r.report_source_item_ID).Select(c => c.foodict.foodict_image).First(),

                            report_description = r.report_description,
                            report_source_user_ID = r.report_source_user_ID,
                            report_source_item_ID = r.report_source_item_ID,
                            report_isDone = r.report_isDone,
                            reporters = others
                        }).First();
                    case 11:
                        return null;
                    default:
                        return null;
                }
            }
            catch
            {
                return null;
            }
            
        }

        public bool penalty(int report_ID, int report_source_item_ID, int report_type, int penalty_amount)
        {
            try
            {
                foodict fd = new foodict();
                List<report> rt = new List<report>();
                //reward
                report rpts = db.reports.Where(r => r.report_ID == report_ID).First();
                foodict fdts = db.foodicts.Where(f => f.user_ID == rpts.report_source_user_ID).First();
                int award = penalty_amount > 10 ? penalty_amount : 10;

                switch (report_type)
                {
                    case 0:
                        //spam post
                        post pt = db.posts.Where(p => p.post_ID == report_source_item_ID).First();
                        fd = db.foodicts.Where(f => f.foodict_ID == pt.foodict_ID).First();

                        //penalize foodict
                        if (fd.foodict_foodie_points >= penalty_amount)
                        {
                            fd.foodict_foodie_points -= penalty_amount;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, pt.post_ID, 122, penalty_amount, pt.post_title, pt.post_image);
                        }
                        else
                        {
                            fd.foodict_foodie_points = 0;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, pt.post_ID, 122, fd.foodict_foodie_points, pt.post_title, pt.post_image);
                        }
                        db.SubmitChanges();
                        
                        //delete item
                        db.posts.DeleteOnSubmit(pt);
                        db.SubmitChanges();

                        //delete report                        
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 0 || r.report_type == 1)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, pt.post_ID, 0, award);

                        return true;
                    case 1:
                        //spam post
                        post ps = db.posts.Where(p => p.post_ID == report_source_item_ID).First();
                        fd = db.foodicts.Where(f => f.foodict_ID == ps.foodict_ID).First();

                        //penalize foodict
                        if (fd.foodict_foodie_points >= penalty_amount)
                        {
                            fd.foodict_foodie_points -= penalty_amount;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, ps.post_ID, 122, penalty_amount, ps.post_title, ps.post_image);
                        }
                        else
                        {
                            fd.foodict_foodie_points = 0;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, ps.post_ID, 122, fd.foodict_foodie_points, ps.post_title, ps.post_image);
                        }
                        db.SubmitChanges();

                        //delete item
                        db.posts.DeleteOnSubmit(ps);
                        db.SubmitChanges();

                        //delete report                        
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 0 || r.report_type == 1)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, ps.post_ID, 0, award);
                        return true;
                    case 10:
                        //spam comment
                        comment ct = db.comments.Where(c => c.comment_ID == report_source_item_ID).First();
                        fd = db.foodicts.Where(f => f.foodict_ID == ct.comment_source_foodict_ID).First();

                        //penalize foodict
                        if (fd.foodict_foodie_points >= penalty_amount)
                        {
                            fd.foodict_foodie_points -= penalty_amount;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, ct.comment_ID, 222, penalty_amount, ct.post.post_title, ct.comment_content);
                        }
                        else
                        {
                            fd.foodict_foodie_points = 0;
                            //create noti
                            fts.createNotification(0, 0, fd.foodict_ID, ct.comment_ID, 222, fd.foodict_foodie_points, ct.post.post_title, ct.comment_content);
                        }
                        db.SubmitChanges();



                        //delete item
                        db.comments.DeleteOnSubmit(ct);
                        db.SubmitChanges();

                        //delete report                        
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 10 || r.report_type == 11)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, ct.comment_ID, 0, award);
                        return true;
                    default:
                        return false;
                }
            }
            catch
            {
                return false;
            }
            
        }

        public bool delete(int report_ID, int report_source_item_ID, int report_type)
        {
            try
            {
                List<report> rt = new List<report>();
                report rpts = db.reports.Where(r => r.report_ID == report_ID).First();
                foodict fdts = db.foodicts.Where(f => f.user_ID == rpts.report_source_user_ID).First();
                int award = 10;

                switch (report_type)
                {
                    case 0:
                        //spam post
                        post pt = db.posts.Where(p => p.post_ID == report_source_item_ID).First();

                        //delete item
                        db.posts.DeleteOnSubmit(pt);
                        db.SubmitChanges();


                        //create noti
                        fts.createNotification(0, 0, pt.foodict_ID, pt.post_ID, 121, 0, pt.post_title, pt.post_image);

                        //delete report
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 0 || r.report_type == 1)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, pt.post_ID, 0, award);
                        return true;

                    case 1:
                        //innapropriate post
                        post ps = db.posts.Where(p => p.post_ID == report_source_item_ID).First();

                        //delete item
                        db.posts.DeleteOnSubmit(ps);
                        db.SubmitChanges();

                        //create noti
                        fts.createNotification(0, 0, ps.foodict_ID, ps.post_ID, 111, 0 , ps.post_title, ps.post_image);


                        //delete report
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 0 || r.report_type == 1)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, ps.post_ID, 0, award);
                        return true;
                    case 10:
                        //spam comment
                        comment ct = db.comments.Where(c => c.comment_ID == report_source_item_ID).First();
                        
                        //delete item
                        db.comments.DeleteOnSubmit(ct);
                        db.SubmitChanges();


                        //create noti
                        fts.createNotification(0, 0, ct.comment_source_foodict_ID, ct.comment_ID, 221, 0, ct.post.post_title, ct.comment_content);

                        //delete report
                        rt = db.reports.Where(r => r.report_source_item_ID == report_source_item_ID && (r.report_type == 10 || r.report_type == 11)).ToList();
                        db.reports.DeleteAllOnSubmit(rt);
                        db.SubmitChanges();

                        //reward
                        fdts.foodict_foodie_points += award;
                        db.SubmitChanges();
                        fts.createNotification(8, 0, fdts.foodict_ID, ct.comment_ID, 0, award);
                        return true;
                    default:
                        return false;
                }
            }
            catch
            {
                return false;
            }

        }
    }



    /*GET*/
    public class SpamObjectGet_Response
    {
        public int report_ID { get; set; }
        public int report_type { get; set; }

        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string target_foodict_username { get; set; }
        public string post_title { get; set; }
        public string report_item_image { get; set; }
        public string comment_content { get; set; }

        public int report_source_user_ID { get; set; }
        public int? report_source_item_ID { get; set; }
        public string report_description { get; set; }
        public DateTime report_date { get; set; }
        public bool report_isDone { get; set; }
        public int otherReportersCount { get; set; }
    }
    public class SpamObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<SpamObjectGet_Response> result { get; set; }
    }


    /*POST*/
    public class SpamObjectPost_Request
    {
        public string api_key { get; set; }
        public int administrator_ID { get; set; }
        public int report_ID { get; set; }
        public int report_type { get; set; }
    }
    public class SpamObjectPost_Response
    {
        public int report_ID { get; set; }
        public int report_type { get; set; }

        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string target_foodict_username { get; set; }
        public string post_title { get; set; }
        public string post_image { get; set; }
        public string post_text { get; set; }
        public DateTime? post_date { get; set; }
        public int bitesCount { get; set; }
        public string report_item_image { get; set; }
        public string comment_content { get; set; }
        public DateTime? comment_date { get; set; }

        public int report_source_user_ID { get; set; }
        public int? report_source_item_ID { get; set; }
        public string report_description { get; set; }
        public DateTime report_date { get; set; }
        public bool report_isDone { get; set; }
        public List<reporter> reporters { get; set; }
    }
    public class SpamObjectPost_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public SpamObjectPost_Response result { get; set; }
    }

    public class reporter
    {
        public int user_ID { get; set; }
        public int foodict_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string report_description { get; set; }
        public DateTime report_date { get; set; }
    }

    /*PUT*/
    public class SpamObjectPut_Request
    {
        public string api_key { get; set; }
        public int administrator_ID { get; set; }
        public int report_ID { get; set; }
        public int report_source_item_ID { get; set; }
        public int report_type { get; set; }
        public int penalty_amount { get; set; }
    }
    public class SpamObjectPut_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }

    /*DELETE*/
    public class SpamObjectDelete_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}