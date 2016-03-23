using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class NewsfeedModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public List<NewsfeedObject_Response> getMyNewsfeed(int foodict_ID, int last_post_ID)
        {
            var followings = db.follows.Where(f => f.follow_source_foodict_ID == foodict_ID && f.follow_status == 1); //get all foodicts he follow
            List<NewsfeedObject_Response> content = new List<NewsfeedObject_Response>();
            foreach (var f in followings)
            {
                foreach (var p in f.foodict1.posts)
                {
                    NewsfeedObject_Response n = new NewsfeedObject_Response(); //new object
                    n.post_ID = p.post_ID;
                    n.post_title = p.post_title;
                    n.post_image = p.post_image;
                    n.post_type = p.post_type;
                    n.post_date = Convert.ToDateTime(p.post_date);
                    n.foodict_ID = p.foodict_ID;
                    n.foodict_username = f.foodict1.user.user_name;
                    n.foodict_image = f.foodict1.foodict_image;
                    n.user_email = f.foodict1.user.user_email;
                    n.post_location_latitude = p.post_location_latitude;
                    n.post_location_longitude = p.post_location_longitude;
                    n.post_availed_offer_ID = p.post_availed_offer_ID;
                    n.post_nearby_establishment = !String.IsNullOrWhiteSpace(p.post_nearby_establishment) ? p.post_nearby_establishment : "";
                    n.isBitten = db.bites.Any(b => b.bite_source_foodict_ID == foodict_ID && b.post_ID == p.post_ID);
                    n.bite_count = p.bites.Count();
                    n.comment_count = p.comments.Count();
                    
                    //n.post_text = !String.IsNullOrWhiteSpace(p.post_text) && p.post_text.Length > 250 ? p.post_text.Substring(0, 250) + "..." : p.post_text;
                    //n.isTruncated = !String.IsNullOrWhiteSpace(p.post_text) && p.post_text.Length > 250 ? true : false;
                    content.Add(n);
                }
                //NewsfeedObject_Response n;
                ////var thisFollowingPosts = db.getPostsOfThisFoodict(f.follow_target_foodict_ID); // get all post of this foodict
                //var thisFollowingPosts = from p in db.posts
                //                         join fd in db.foodicts on p.foodict_ID equals fd.foodict_ID
                //                         where p.foodict_ID == f.follow_target_foodict_ID
                //                         select new NewsfeedObject_Response { 
                //                            post_ID = p.post_ID,
                //                            post_title = p.post_title,
                //                            post_image = p.post_image,
                //                            post_type = p.post_type,
                //                            post_date = Convert.ToDateTime(p.post_date),
                //                            foodict_ID = fd.foodict_ID,
                //                            foodict_username = fd.foodict_username,
                //                            foodict_image = fd.foodict_image,
                //                            post_nearby_establishment = p.post_nearby_establishment,
                //                            post_text = p.post_text,
                //                            post_location_latitude = p.post_location_latitude,
                //                            post_location_longitude = p.post_location_longitude,
                //                         };

                
            }
            return content.OrderByDescending(p => p.post_ID).Where(p=>p.post_ID < last_post_ID).Take(10).ToList();
        }

        public NewsfeedDetailObject_Response getPostDetails(int foodict_ID, int post_ID)
        {
            NewsfeedDetailObject_Response result = new NewsfeedDetailObject_Response();
            var query = from p in db.posts
                        join f in db.foodicts on p.foodict_ID equals f.foodict_ID
                        where p.post_ID == post_ID
                        select new NewsfeedDetailObject_Response
                        {
                            post_ID = p.post_ID,
                            post_title = p.post_title,
                            post_image = p.post_image,
                            post_date = Convert.ToDateTime(p.post_date),
                            post_text = p.post_text,
                            foodict_ID = f.foodict_ID,
                            foodict_username = f.user.user_name,
                            foodict_image = f.foodict_image,
                            post_location_latitude = p.post_location_latitude,
                            post_location_longitude = p.post_location_longitude,
                            post_nearby_establishment = p.post_nearby_establishment,
                            isBitten = db.bites.Any(b => b.bite_source_foodict_ID == foodict_ID && b.post_ID == p.post_ID),
                            bites = db.bites.Where(b => b.post_ID == p.post_ID).Select(b => new foodict_item { foodict_ID = b.bite_source_foodict_ID, foodict_username = b.foodict.user.user_name }).ToList(),
                            comments = db.comments.Where(c => c.post_ID == p.post_ID).Select(c => new foodict_item { foodict_ID = c.foodict.foodict_ID, foodict_username = c.foodict.user.user_name }).ToList(),
                            post_rating = p.post_rating

                            //bites = db.bites.Where(b => b.post_ID == p.post_ID).Select(b => new foodict_item { foodict_ID = b.bite_source_foodict_ID, foodict_username = b.foodict.foodict_username, foodict_image = b.foodict.foodict_image, foodict_first_name = b.foodict.foodict_first_name + " ", foodict_middle_name = b.foodict.foodict_middle_name + " ", foodict_last_name = b.foodict.foodict_last_name, isFollowed = db.follows.Any(fl => fl.follow_source_foodict_ID == p.foodict_ID && fl.follow_target_foodict_ID == b.foodict.foodict_ID) }).ToList(),
                            //comments = db.comments.Where(c => c.post_ID == p.post_ID).Select(c => new foodict_item { foodict_ID = c.foodict.foodict_ID, foodict_username = c.foodict.foodict_username, foodict_image = c.foodict.foodict_image, foodict_first_name = c.foodict.foodict_first_name + " ", foodict_middle_name = c.foodict.foodict_middle_name + " ", foodict_last_name = c.foodict.foodict_last_name, isFollowed = db.follows.Any(fl => fl.follow_source_foodict_ID == p.foodict_ID && fl.follow_target_foodict_ID == c.foodict.foodict_ID) }).ToList(),
                            
                        };
            return query.First();
        }

        public bool biteThisPost(int post_ID, int bite_source_foodict_ID)
        {
            if (!db.bites.Any(b => b.bite_source_foodict_ID == bite_source_foodict_ID && b.post_ID == post_ID))
            {
                var query = db.posts.Where(p => p.post_ID == post_ID).First();

                bite b = new bite();
                b.post_ID = post_ID;
                b.bite_source_foodict_ID = bite_source_foodict_ID;
                db.bites.InsertOnSubmit(b);
                db.SubmitChanges();

                foodict f = db.foodicts.Where(d => d.foodict_ID == query.foodict_ID).First();
                f.foodict_foodie_points += 1;
                db.SubmitChanges();

                //create notification
                if (bite_source_foodict_ID != query.foodict_ID)
                {
                    fts.createNotification(1, bite_source_foodict_ID, query.foodict_ID, query.post_ID, 0);
                }
                return true;
            }
            else
            {
                return false;
            }
        }

        public bool deleteThisPost(int foodict_ID, int post_ID)
        {
            if (db.posts.Any(p => p.foodict_ID == foodict_ID && p.post_ID == post_ID))
            {
                post p = db.posts.Where(d => d.foodict_ID == foodict_ID && d.post_ID == post_ID).First();
                db.posts.DeleteOnSubmit(p);
                db.SubmitChanges();

                fts.foodieAzureStorageDelete(post_ID.ToString(), "posts");
                return true;
            }
            else
            {
                return false;
            }
        }
    }


    //Whole Newsfeed
    public class NewsfeedObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<NewsfeedObject_Response> result { get; set; }
    }

    public class NewsfeedObject_Request
    {
        public int post_ID { get; set; }
        public string api_key { get; set; }
    }

    public class NewsfeedObject_Response
    {
        public int post_ID { get; set; }
        public string post_title { get; set; }
        public string post_text { get; set; }
        public string post_image { get; set; }
        public string post_type { get; set; }
        public int foodict_ID { get; set; }
        public DateTime post_date { get; set; }
        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string user_email { get; set; }
        public string post_nearby_establishment { get; set; }
        public string post_location_latitude { get; set; }
        public string post_location_longitude { get; set; }
        public bool isTruncated { get; set; }
        public bool isBitten { get; set; }
        public int? post_availed_offer_ID { get; set; }
        public int? bite_count { get; set; }
        public int? comment_count { get; set; }
    }

    public class foodict_item
    {
        public int foodict_ID { get; set; }
        public string foodict_username { get; set; }
        //public string foodict_image { get; set; }
        //public string foodict_first_name { get; set; }
        //public string foodict_middle_name { get; set; }
        //public string foodict_last_name { get; set; }
        //public bool isFollowed { get; set; }
    }


    //Individual Post On Newsfeed
    public class NewsfeedDetailObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool hasLocation { get; set; }
        public NewsfeedDetailObject_Response result { get; set; }
    }

    public class NewsfeedDetailObject_Response
    {
        public int post_ID { get; set; }
        public string post_title { get; set; }
        public string post_image { get; set; }
        public DateTime post_date { get; set; }
        public int foodict_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string user_email { get; set; }
        public string post_text { get; set; }
        public string post_location_latitude { get; set; }
        public string post_location_longitude { get; set; }
        public string post_nearby_establishment { get; set; }
        public bool isBitten { get; set; }
        public List<foodict_item> bites { get; set; }
        public List<foodict_item> comments { get; set; }
        public int? post_rating { get; set; }
    }

    //Bites

    public class BiteObject_Request
    {
        public string api_key { get; set; }
        public int post_ID { get; set; }
        public int bite_source_foodict_ID { get; set; }
        public int foodict_ID { get; set; }
    }

    public class BiteObject_Response
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }


    //Delete
    public class DeleteObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}