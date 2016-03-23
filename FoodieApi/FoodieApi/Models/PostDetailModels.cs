using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class PostDetailModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();

        public List<PostDetailObjectGet_Response> getFoodicts(int post_ID, int foodict_ID, int type)
        {
            if (type == 0)
            {
                return db.bites.Where(b => b.post_ID == post_ID).Select(b => new PostDetailObjectGet_Response { foodict_ID = b.bite_source_foodict_ID, foodict_username = b.foodict.user.user_name, foodict_image = b.foodict.foodict_image, foodict_first_name = b.foodict.foodict_first_name + " ", foodict_middle_name = b.foodict.foodict_middle_name + " ", foodict_last_name = b.foodict.foodict_last_name, isFollowed = db.follows.Any(fl => fl.follow_source_foodict_ID == foodict_ID && fl.follow_target_foodict_ID == b.foodict.foodict_ID) }).ToList();
            }
            else
            {
                return db.comments.Where(c => c.post_ID == post_ID).Select(c => new PostDetailObjectGet_Response { foodict_ID = c.foodict.foodict_ID, foodict_username = c.foodict.user.user_name, foodict_image = c.foodict.foodict_image, foodict_first_name = c.foodict.foodict_first_name + " ", foodict_middle_name = c.foodict.foodict_middle_name + " ", foodict_last_name = c.foodict.foodict_last_name, isFollowed = db.follows.Any(fl => fl.follow_source_foodict_ID == foodict_ID && fl.follow_target_foodict_ID == c.foodict.foodict_ID) }).ToList();
            }                            
        }
    }


    //GET

    public class PostDetailObjectGet_Response
    {
        public int foodict_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
        public string foodict_first_name { get; set; }
        public string foodict_middle_name { get; set; }
        public string foodict_last_name { get; set; }
        public bool isFollowed { get; set; }
    }

    public class PostDetailObjectGet_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<PostDetailObjectGet_Response> result { get; set; }
    }
}