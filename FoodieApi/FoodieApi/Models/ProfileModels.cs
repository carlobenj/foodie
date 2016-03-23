using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class ProfileModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public ProfileObject_Response getMyProfileDetails(int user_ID, int foodict_ID)
        {
            ProfileObject_Response result = (from f in db.foodicts
                    join u in db.users on f.user_ID equals u.user_ID
                    where f.user_ID == user_ID && f.foodict_ID == foodict_ID
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
            result.count_post = db.posts.Where(p => p.foodict_ID == foodict_ID).Count();
            result.count_follower = db.follows.Where(f => f.follow_target_foodict_ID == foodict_ID && f.follow_status == 1).Count() - 1; //follows yourself
            result.count_following = db.follows.Where(f => f.follow_source_foodict_ID == foodict_ID && f.follow_status == 1).Count() - 1; //follows yourself

            return result;
        }

        public ProfileObjectGrid_Response getPostsGrid(int target_foodict_ID, int foodict_ID)
        {
            foodict target = db.foodicts.Where(f => f.foodict_ID == target_foodict_ID).First();
            if (target.foodict_isPrivate == false)
            {
                //nde private
                List<individual_post> allPosts = db.posts.Where(p => p.foodict_ID == target_foodict_ID && p.post_type != "2").Select(p => new individual_post
                {
                    post_ID = p.post_ID,
                    post_image = p.post_image
                }).OrderByDescending(p => p.post_ID).ToList<individual_post>();

                return new ProfileObjectGrid_Response { allPost = allPosts, isLocked = false };
            }
            else
            { 
                //private
                if (db.follows.Any(f => f.follow_source_foodict_ID == foodict_ID && f.follow_target_foodict_ID == target_foodict_ID && f.follow_status == 1))
                {
                    //nifofollow
                    List<individual_post> allPosts = db.posts.Where(p => p.foodict_ID == target_foodict_ID && p.post_type != "2").Select(p => new individual_post
                    {
                        post_ID = p.post_ID,
                        post_image = p.post_image
                    }).OrderByDescending(p => p.post_ID).ToList<individual_post>();

                    return new ProfileObjectGrid_Response { allPost = allPosts, isLocked = false };
                }
                else
                { 
                    //locked
                    return new ProfileObjectGrid_Response { allPost = null, isLocked = true };
                }

            }
        }

        public bool editMyProfileDetails(ProfileEditObject_Request obj)
        {
            try
            {
                //select the row
                foodict f = db.foodicts.Where(fd => fd.foodict_ID == obj.foodict_ID && fd.user_ID == obj.user_ID).First();

                if (obj.type == 1)
                {
                    string uri = fts.foodieAzureStorageUpload(obj.foodict_image, f.foodict_ID.ToString(), "foodicts");
                    if (uri != null)
                    {
                        f.foodict_image = uri;
                        db.SubmitChanges();
                        return true;
                    }
                    else 
                    {
                        return false;
                    }
                }
                else if (obj.type == 2)
                {
                    //f.user.user_name = obj.foodict_username;
                    f.foodict_first_name = obj.foodict_first_name;
                    f.foodict_middle_name = obj.foodict_middle_name;
                    f.foodict_last_name = obj.foodict_last_name;
                    f.foodict_isMale = obj.foodict_isMale;

                    db.SubmitChanges();                    
                    return true;
                }
                else if (obj.type == 3)
                {
                    f.foodict_contact = obj.foodict_contact;
                    f.foodict_country = obj.foodict_country;
                    f.foodict_city = obj.foodict_city;

                    db.SubmitChanges();
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
    }

    public class ProfileObject_Response
    {
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }        
        public string foodict_username { get; set; }
        public string foodict_first_name { get; set; }
        public string foodict_middle_name { get; set; }
        public string foodict_last_name { get; set; }
        public bool? foodict_isMale { get; set; }
        public string foodict_contact { get; set; }
        public string foodict_country { get; set; }
        public string foodict_city { get; set; }
        public string foodict_image { get; set; }
        public string user_email { get; set; }
        public int? count_post { get; set; }
        public int? count_point { get; set; }
        public int? count_follower { get; set; }
        public int? count_following { get; set; }
        public bool isFollowed { get; set; }
        public int follow_status { get; set; }
    }

    public class ProfileObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public ProfileObject_Response result { get; set; }   
    }


    //GRID
    public class ProfileObjectGrid_Request
    {
        public string api_key { get; set; }
        public int user_ID { get; set; }
        public int foodict_ID { get; set; }
        public int target_foodict_ID { get; set; }
    }

    public class ProfileObjectGrid_Response
    {
        public bool isLocked { get; set; }
        public List<individual_post> allPost { get; set; }
    }

    public class individual_post
    {
        public int post_ID { get; set; }
        public string post_image { get; set; }
    }


    public class ProfileObjectGrid_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool isLocked { get; set; }
        public List<individual_post> result { get; set; }
    }

    //Edit Profile
    public class ProfileEditObject_Request
    {
        public string api_key { get; set; }
        public int foodict_ID { get; set; }
        public int user_ID { get; set; }
        public int type { get; set; }

        //type 1
        public string foodict_username { get; set; }
        public string foodict_first_name { get; set; }
        public string foodict_middle_name { get; set; }
        public string foodict_last_name { get; set; }
        public bool? foodict_isMale { get; set; }
        public string foodict_contact { get; set; }
        public string foodict_country { get; set; }
        public string foodict_city { get; set; }

        //type 2
        public string foodict_image { get; set; }
    }

    public class EditProfileObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}