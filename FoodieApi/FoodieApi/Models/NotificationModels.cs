using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{    
    public class NotificationModels
    {
        //First Level Notifications
        //0 = Administrative, 1 = Bite, 2 = Comment, 3 = Follow, 4 = Accepted your request, 5 = FB Friend on Foodie

        //Second Level Notifications
        //11 = Follower Request

        FoodieDBDataContext db = new FoodieDBDataContext();

        //GET
        public int getNewNotificationCount(int foodict_ID) 
        {
            try
            {
                return db.notifications.Where(n => n.notification_target_foodict_ID == foodict_ID && n.notification_isDone == false).Count();
            }
            catch
            {
                return 0;
            }
        }

        //POST
        public List<NotificationObject_Response> getMyNotifications(int foodict_ID)
        {
            try
            {
                List<NotificationObject_Response> result = new List<NotificationObject_Response>();
                NotificationObject_Response obj = new NotificationObject_Response();
                var query = db.notifications.Where(n => n.notification_target_foodict_ID == foodict_ID).OrderByDescending(n=>n.notification_date).ToList();
                foreach (var item in query)
                {
                    //Conditional Info
                    try
                    {
                        if (item.notification_type == 0)
                        {
                            //Administrative Notification
                            obj = (from f in db.foodicts
                                   where f.foodict_ID == item.notification_target_foodict_ID
                                   select new NotificationObject_Response
                                   {
                                       source_username = "Foodie",
                                       target_username = f.user.user_name,
                                       admin_noti_type = item.notification_misc_ID_2,
                                       penalty = item.notification_misc_data_int,
                                       post_ID = Convert.ToInt32(item.notification_misc_ID_1),
                                       post_title = item.notification_misc_data_string1,
                                       post_image = item.notification_misc_data_string2,
                                       comment_content = item.notification_misc_data_string2
                                       
                                   }).First();

                            
                            //post postObj = new post();
                            //comment commentObj = new comment();
                            //switch(item.notification_misc_ID_2)
                            //{
                            //    case 111:
                            //        postObj = db.posts.Where(p => p.post_ID == item.notification_misc_ID_1).First();
                            //        obj = db.foodicts.Where(f => f.foodict_ID == item.notification_target_foodict_ID)
                            //                .Select(f => new NotificationObject_Response{
                            //                   source_username = "Foodie",
                            //                   target_username = f.user.user_name,
                            //                   admin_noti_type = item.notification_misc_ID_2,
                            //                   post_title = postObj.post_title,
                            //                   post_image = postObj.post_image,                                               
                            //                   noti_desc = postObj.post_title,
                            //                }).First();
                            //}



                        }
                        else if (item.notification_type == 1)
                        {
                            //Bite
                            obj = (from b in db.bites
                                   join f in db.foodicts on b.bite_source_foodict_ID equals f.foodict_ID
                                   join p in db.posts on b.post_ID equals p.post_ID
                                   where f.foodict_ID == item.notification_source_foodict_ID && p.post_ID == item.notification_misc_ID_1
                                   select new NotificationObject_Response
                                   {
                                       source_username = f.user.user_name,
                                       source_user_image = f.foodict_image,
                                       post_title = p.post_title,
                                       post_ID = p.post_ID,
                                       post_image = p.post_image
                                   }).First();
                        }
                        else if (item.notification_type == 2)
                        {
                            //Comment
                            obj = (from c in db.comments
                                   join f in db.foodicts on c.comment_source_foodict_ID equals f.foodict_ID
                                   join p in db.posts on c.post_ID equals p.post_ID
                                   where c.comment_ID == item.notification_misc_ID_2 && p.post_ID == item.notification_misc_ID_1 && f.foodict_ID == item.notification_source_foodict_ID
                                   select new NotificationObject_Response
                                   {
                                       source_username = f.user.user_name,
                                       source_user_image = f.foodict_image,
                                       post_title = p.post_title,
                                       post_ID = p.post_ID,
                                       post_image = p.post_image,
                                       comment_content = c.comment_content
                                   }).First();
                        }
                        else if (item.notification_type == 3)
                        {
                            //Follow
                            obj = (from f in db.follows
                                   join fds in db.foodicts on f.follow_source_foodict_ID equals fds.foodict_ID
                                   join fdt in db.foodicts on f.follow_target_foodict_ID equals fdt.foodict_ID
                                   where f.follow_ID == item.notification_misc_ID_1 && fds.foodict_ID == item.notification_source_foodict_ID && fdt.foodict_ID == item.notification_target_foodict_ID
                                   select new NotificationObject_Response
                                   {
                                       source_username = fds.user.user_name,
                                       source_user_image = fds.foodict_image,
                                       target_username = fdt.user.user_name,
                                       target_user_image = fdt.foodict_image,
                                       follow_ID = f.follow_ID
                                   }).First();
                        }
                        else if (item.notification_type == 4)
                        {
                            //Follow accept
                            obj = (from f in db.follows
                                   join fds in db.foodicts on f.follow_source_foodict_ID equals fds.foodict_ID
                                   join fdt in db.foodicts on f.follow_target_foodict_ID equals fdt.foodict_ID
                                   where f.follow_ID == item.notification_misc_ID_1 && fds.foodict_ID == item.notification_target_foodict_ID && fdt.foodict_ID == item.notification_source_foodict_ID
                                   select new NotificationObject_Response
                                   {
                                       source_username = fdt.user.user_name,
                                       source_user_image = fdt.foodict_image,
                                       target_username = fds.user.user_name,
                                       target_user_image = fdt.foodict_image,
                                       follow_ID = f.follow_ID
                                   }).First();
                        }
                        else if (item.notification_type == 11)
                        {
                            //Folow request
                            obj = (from f in db.follows
                                   join fds in db.foodicts on f.follow_source_foodict_ID equals fds.foodict_ID
                                   join fdt in db.foodicts on f.follow_target_foodict_ID equals fdt.foodict_ID
                                   where f.follow_ID == item.notification_misc_ID_1 && fds.foodict_ID == item.notification_source_foodict_ID && fdt.foodict_ID == item.notification_target_foodict_ID && f.follow_status == 2
                                   select new NotificationObject_Response
                                   {
                                       source_username = fds.user.user_name,
                                       source_user_image = fds.foodict_image,
                                       target_username = fdt.user.user_name,
                                       target_user_image = fdt.foodict_image,
                                       follow_ID = f.follow_ID
                                   }).First();
                        }
                        else if (item.notification_type == 5)
                        {
                            //FB Friend
                            obj = db.foodicts.Where(f => f.foodict_ID == item.notification_source_foodict_ID).Select(f => new NotificationObject_Response {
                                source_username = f.user.user_name,
                                source_user_image = f.foodict_image,
                                full_name = f.foodict_first_name + " " + f.foodict_middle_name + " " + f.foodict_last_name
                            }).First();
                        }
                        else if (item.notification_type == 8)
                        {
                            //FB Friend
                            obj = db.foodicts.Where(f => f.foodict_ID == item.notification_target_foodict_ID).Select(f => new NotificationObject_Response
                            {
                                target_username = f.user.user_name,
                                penalty = item.notification_misc_data_int
                            }).First();
                        }
                        else
                        {
                        }


                        //Necessarry Info
                        obj.notification_ID = item.notification_ID;
                        obj.notification_type = item.notification_type;
                        obj.source_ID = item.notification_source_foodict_ID;
                        obj.target_ID = item.notification_target_foodict_ID;
                        obj.isDone = item.notification_isDone;
                        obj.date = item.notification_date;

                        //ordering
                        if (item.notification_type == 11)
                        {
                            result.Insert(0,obj);
                        }
                        else
                        {
                            result.Add(obj);
                        }
                    }
                    catch
                    {
                        notification n = db.notifications.Where(d=>d.notification_ID == item.notification_ID).First();
                        db.notifications.DeleteOnSubmit(n);
                        db.SubmitChanges();
                    }
                }

                //return result
                return result;
            }
            catch
            {
                return null;
            }
        }

        public bool markAllNotifications(List<int> items)
        {
            try
            {
                foreach (int notification_ID in items)
                {
                    notification n = db.notifications.Where(d => d.notification_ID == notification_ID).First();
                    if (n.notification_type < 10)
                    {
                        n.notification_isDone = true;
                        db.SubmitChanges();
                    }
                }
                return true;
            }
            catch 
            {
                return false;
            }
            
        }

        public bool deleteNotification(int notification_ID)
        {
            try
            {
                notification n = db.notifications.Where(d => d.notification_ID == notification_ID).First();
                db.notifications.DeleteOnSubmit(n);
                db.SubmitChanges();
                return true;
            }
            catch
            {
                return false;
            }

        }

    }

    //GET
    public class NotificationObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public int result { get; set; }
    }

    //POST
    public class NotificationObjectPost_Request
    {
        public string api_key { get; set; }
        public int user_ID { get; set; }
        public int foodict_ID { get; set; }
    }

    public class NotificationObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<NotificationObject_Response> result { get; set; }
    }

    public class NotificationObject_Response
    {
        public int notification_ID { get; set; }
        public int notification_type { get; set; }

        //source
        public int source_ID { get; set; }
        public string source_username { get; set; }
        public string source_user_image { get; set; }

        //target
        public int target_ID { get; set; }
        public string target_username { get; set; }
        public string target_user_image { get; set; }

        //misc
        public int post_ID { get; set; }
        public string post_title { get; set; }
        public string comment_content { get; set; }
        public string post_image { get; set; }
        public int follow_ID { get; set; }
        public string full_name { get; set; }
        public string noti_desc { get; set; }
        public int? admin_noti_type { get; set; }
        public int? penalty { get; set; }

        //flags
        public DateTime? date { get; set; }
        public bool? isDone { get; set; }
    }


    //PUT && Delete
    public class NotificationObjectPutDelete_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }

    public class NotificationObjectPut_Request
    {
        public string api_key { get; set; }
        public int user_ID { get; set; }
        public int foodict_ID { get; set; }

        public List<int> items_ID { get; set; }
    }

}