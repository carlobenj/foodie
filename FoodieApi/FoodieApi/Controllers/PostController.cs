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
    public class PostController : ApiController
    {
        PostModels md = new PostModels();
        FoodieToolSet fts = new FoodieToolSet();

        public PostObject_ResponseWrapper PostNewBlog(PostObject_Insert obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            PostObject_ResponseWrapper response = new PostObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && obj.foodict_ID == credentials.MyID)
            {
                response.isAuthorized = true;
                response.result = md.postNewBlog(obj);
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


