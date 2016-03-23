using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using FoodieApi.Models;

namespace FoodieApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CommentController : ApiController
    {
        CommentModels md = new CommentModels();
        FoodieToolSet fts = new FoodieToolSet();

        public CommentObject_ResponseWrapper Get(int post_ID, string api_key)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            CommentObject_ResponseWrapper response = new CommentObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.getAllComment(post_ID);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public CommentObject_ResponseWrapper PostNewComment(CommentObject_Insert obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            CommentObject_ResponseWrapper response = new CommentObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && obj.foodict_ID == credentials.MyID)
            {
                response.isAuthorized = true;
                response.result = md.postNewComment(obj);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public DeleteCommentObject_ResponseWrapper Delete(string api_key, int foodict_ID, int comment_ID)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            DeleteCommentObject_ResponseWrapper response = new DeleteCommentObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && foodict_ID == credentials.MyID)
            {
                response.isAuthorized = true;
                response.result = md.deleteThisComment(comment_ID, credentials.MyID);
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }

        
    }
    
}
