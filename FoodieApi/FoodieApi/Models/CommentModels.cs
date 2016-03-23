using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodieApi.Models
{
    public class CommentModels
    {
        FoodieDBDataContext db = new FoodieDBDataContext();
        FoodieToolSet fts = new FoodieToolSet();
        public List<CommentObject_Response> getAllComment(int post_ID)
        {
            var query = from c in db.comments
                        join f in db.foodicts on c.comment_source_foodict_ID equals f.foodict_ID
                        where c.post_ID == post_ID
                        select new CommentObject_Response
                        {
                            comment_ID = c.comment_ID,
                            comment_date = Convert.ToDateTime(c.comment_date),
                            comment_content = c.comment_content,
                            foodict_ID = f.foodict_ID,
                            foodict_image = f.foodict_image,
                            foodict_username = f.user.user_name
                        };
            return query.ToList<CommentObject_Response>();
            //return db.getCommentsForThisPost(post_ID).ToList();
        }

        public List<CommentObject_Response> postNewComment(CommentObject_Insert obj)
        {
            try
            {
                //var query = db.comments.Where(c => c.post_ID == obj.post_ID);
                comment c = new comment();
                c.post_ID = obj.post_ID;
                c.comment_date = DateTime.UtcNow;
                c.comment_source_foodict_ID = obj.foodict_ID;
                c.comment_content = obj.comment_content;
                db.comments.InsertOnSubmit(c);
                db.SubmitChanges();

                //create notification
                var query = db.posts.Where(p => p.post_ID == obj.post_ID).First();

                if (obj.foodict_ID != query.foodict_ID)
                {
                    fts.createNotification(2, obj.foodict_ID, query.foodict_ID, obj.post_ID, c.comment_ID);
                }

                return getAllComment(obj.post_ID);
            }
            catch 
            {
                return null;
            }
            

        }

        public bool deleteThisComment(int comment_ID, int foodict_ID)
        {
            if (db.comments.Any(d => d.comment_ID == comment_ID && d.comment_source_foodict_ID == foodict_ID))
            {
                comment c = db.comments.Where(d => d.comment_ID == comment_ID && d.comment_source_foodict_ID == foodict_ID).First();
                db.comments.DeleteOnSubmit(c);
                db.SubmitChanges();
                return true;
            }
            else
            {
                return false;
            }
        }

    }

    //Comment Classes
    public class CommentObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public List<CommentObject_Response> result { get; set; }
    }

    public class CommentObject_Response
    {
        public int comment_ID { get; set; }
        public string comment_content { get; set; }
        public DateTime comment_date { get; set; }
        public int foodict_ID { get; set; }
        public string foodict_username { get; set; }
        public string foodict_image { get; set; }
    }

    public class CommentObject_Insert
    {
        public string api_key { get; set; }
        public int post_ID { get; set; }
        public int foodict_ID { get; set; }
        public string comment_content { get; set; }
    }

    //delete

    public class DeleteCommentObject_ResponseWrapper
    {
        public bool isAuthorized { get; set; }
        public bool result { get; set; }
    }
}