using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class FollowingModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        public List<FollowingObject_Response> getFollowing(int foodict_ID, int target_foodict_ID)
        {
            List<FollowingObject_Response> response = new List<FollowingObject_Response>();

            //determine if other account
            List<follow> followings = db.follows.Where(l => l.follow_source_foodict_ID == target_foodict_ID && l.follow_status == 1).OrderBy(l => l.follow_status).ToList();
            foreach(var item in followings)
            {
                bool isFollowedByMe = db.follows.Any(f => f.follow_source_foodict_ID == foodict_ID && f.follow_target_foodict_ID == item.follow_target_foodict_ID);
                //check status if followed
                int status = 0; // not followed
                if (isFollowedByMe)
                {
                    status = db.follows.Where(f => f.follow_source_foodict_ID == foodict_ID && f.follow_target_foodict_ID == item.follow_target_foodict_ID).Select(f => f.follow_status).First();
                }
                
                FollowingObject_Response query = (from f in db.foodicts
                             join u in db.users on f.user_ID equals u.user_ID
                             where f.foodict_ID == item.follow_target_foodict_ID
                             select new FollowingObject_Response
                             {
                                 follow_ID = item.follow_ID,
                                 foodict_ID = f.foodict_ID,
                                 user_ID = u.user_ID,
                                 foodict_username = f.user.user_name,
                                 foodict_first_name = f.foodict_first_name,
                                 foodict_middle_name = f.foodict_middle_name,
                                 foodict_last_name = f.foodict_last_name,
                                 foodict_image = f.foodict_image,
                                 isFollowed = isFollowedByMe,
                                 follow_status = status
                             }).First();
                response.Add(query);
            }
            return response;
        }
    }

    public class FollowingObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<FollowingObject_Response> result { get; set; }
    }

    public class FollowingObject_Response
    {
        public int follow_ID { get; set; }
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
        public string foodict_first_name { get; set; }
        public string foodict_middle_name { get; set; }
        public string foodict_last_name { get; set; }
        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public bool isFollowed { get; set; }
        public int follow_status { get; set; }
    }

    

}