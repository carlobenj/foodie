using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class FollowModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public bool unfollowThisFoodict(int source_foodict_ID, int target_foodict_ID)
        {
            try
            {
                if (db.follows.Any(f => f.follow_source_foodict_ID == source_foodict_ID && f.follow_target_foodict_ID == target_foodict_ID))
                {
                    follow obj = db.follows.Where(f => f.follow_source_foodict_ID == source_foodict_ID && f.follow_target_foodict_ID == target_foodict_ID).First();
                    db.follows.DeleteOnSubmit(obj);
                    db.SubmitChanges();

                    if (db.notifications.Any(d => d.notification_source_foodict_ID == source_foodict_ID && d.notification_target_foodict_ID == target_foodict_ID && d.notification_type == 11))
                    {
                        notification n = db.notifications.Where(d => d.notification_source_foodict_ID == source_foodict_ID && d.notification_target_foodict_ID == target_foodict_ID && d.notification_type == 11).First();
                        db.notifications.DeleteOnSubmit(n);
                        db.SubmitChanges();
                    }

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch 
            {
                return false;
            }
            
        }

        public FollowObject_Response followThisFoodict(int source_foodict_ID, int target_foodict_ID)
        {
            try
            {
                
                    if (!db.follows.Any(f => f.follow_source_foodict_ID == source_foodict_ID && f.follow_target_foodict_ID == target_foodict_ID))
                    {
                        //insert new follow instance
                        follow obj = new follow();
                        obj.follow_source_foodict_ID = source_foodict_ID;
                        obj.follow_target_foodict_ID = target_foodict_ID;


                        if (Convert.ToBoolean(db.foodicts.Where(f => f.foodict_ID == target_foodict_ID).Select(f => f.foodict_isPrivate).First()))
                        {
                            //private foodict
                            if(source_foodict_ID != target_foodict_ID)
                            {
                                obj.follow_status = 2; //flag it as requested
                                db.follows.InsertOnSubmit(obj);
                                db.SubmitChanges();

                                //=-=-=-=-=-=---=-=-REQUEST FOLLOW-=-=-=-=-=-=--=-=-=
                                fts.createNotification(11, source_foodict_ID, target_foodict_ID, obj.follow_ID, 0);
                            }
                        }
                        else 
                        {
                            obj.follow_status = 1; 
                            db.follows.InsertOnSubmit(obj);
                            db.SubmitChanges();

                            if (source_foodict_ID != target_foodict_ID)
                            {
                                fts.createNotification(3, source_foodict_ID, target_foodict_ID, obj.follow_ID, 0);
                            }
                            //create request notification
                        }

                        //create notification
                       

                        //retrieve data from that instance plus other data needed
                        FollowObject_Response query = (from f in db.foodicts
                                                       join u in db.users on f.user_ID equals u.user_ID
                                                       where f.foodict_ID == target_foodict_ID
                                                       select new FollowObject_Response
                                                       {
                                                           follow_ID = obj.follow_ID,
                                                           foodict_ID = f.foodict_ID,
                                                           user_ID = u.user_ID,
                                                           foodict_username = f.user.user_name,
                                                           foodict_image = f.foodict_image,
                                                           follow_status = obj.follow_status                                                           
                                                       }).First();
                        return query;
                    }
                    else
                    {
                        return null;
                    }
                
            }
            catch
            {
                return null;
            }
            

        }



        public bool actionRequest(int notification_ID, int follow_ID, bool isAccepted)
        {
            try
            {
                if (isAccepted)
                {
                    follow f = db.follows.Where(d => d.follow_ID == follow_ID).First(); //select the row on focus                
                    f.follow_status = 1;
                    db.SubmitChanges();

                    //=-=-=ACCEPT noti
                    fts.createNotification(4, f.follow_target_foodict_ID, f.follow_source_foodict_ID, f.follow_ID);
                }
                else
                {
                    follow f = db.follows.Where(d => d.follow_ID == follow_ID).First(); //select the row on focus                
                    db.follows.DeleteOnSubmit(f);
                    db.SubmitChanges();
                }


                //delete the notification
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

    public class UnfollowObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }

    public class FollowObject_Request
    {
        public string api_key { get; set; }
        public int source_foodict_ID { get; set; }
        public int target_foodict_ID { get; set; }
    }

    public class FollowObject_Response
    {
        public int follow_ID { get; set; }
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public int follow_status { get; set; }
    }

    public class FollowObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public FollowObject_Response result { get; set; }
    }



    //PUT - accept or reject follow request
    public class FollowObjectPut_Request
    {
        public string api_key { get; set; }
        public int foodict_ID { get; set; }
        public int notification_ID { get; set; }
        public int follow_ID { get; set; }
        public bool isAccepted { get; set; }
    }

    public class FollowObjectPut_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}