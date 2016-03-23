using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class OtherProfileModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        public ProfileObject_Response getThisFoodictProfile(int foodict_ID, int target_foodict_ID)
        {
            ProfileObject_Response result = (from f in db.foodicts
                                             join u in db.users on f.user_ID equals u.user_ID
                                             where f.foodict_ID == target_foodict_ID
                                             select new ProfileObject_Response
                                             {
                                                 foodict_ID = f.foodict_ID,
                                                 user_ID = f.user_ID,
                                                 foodict_username = f.user.user_name,
                                                 foodict_first_name = f.foodict_first_name,
                                                 foodict_middle_name = f.foodict_middle_name,
                                                 foodict_last_name = f.foodict_last_name,
                                                 foodict_isMale = f.foodict_isMale,
                                                 foodict_contact = f.foodict_contact,
                                                 foodict_country = f.foodict_country,
                                                 foodict_city = f.foodict_city,
                                                 count_point = f.foodict_foodie_points,
                                                 foodict_image = f.foodict_image,
                                                 user_email = u.user_email

                                             }).First();
            result.count_post = db.posts.Where(p => p.foodict_ID == target_foodict_ID).Count();
            result.count_follower = db.follows.Where(f => f.follow_target_foodict_ID == target_foodict_ID && f.follow_status == 1).Count() - 1; //follows yourself
            result.count_following = db.follows.Where(f => f.follow_source_foodict_ID == target_foodict_ID && f.follow_status == 1).Count() - 1; //follows yourself
            result.isFollowed = db.follows.Any(f => f.follow_source_foodict_ID == foodict_ID && f.follow_target_foodict_ID == target_foodict_ID);
            
            int status = 0; // not followed
            if (result.isFollowed)
            {
                status = db.follows.Where(f => f.follow_source_foodict_ID == foodict_ID && f.follow_target_foodict_ID == target_foodict_ID).Select(f => f.follow_status).First();
            }

            result.follow_status = status;

            return result;
        }
    }

    public class OtherProfile_Request
    {
        public string api_key { get; set; }
        public int user_ID { get; set; }
        public int foodict_ID { get; set; }

        public int other_foodict_ID { get; set; }
    }

    public class OtherProfile_Response
    {
        public int foodict_ID { get; set; }
    }

    public class OtherProfile_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public OtherProfile_Response result { get; set; }
    }

}