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
    public class NewsfeedController : ApiController
    {
        NewsfeedModels md = new NewsfeedModels();
        FoodieToolSet fts = new FoodieToolSet();
        //Whole Newsfeed
        public NewsfeedObject_ResponseWrapper Get(string api_key, int last_post_ID = 999999999)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            NewsfeedObject_ResponseWrapper response = new NewsfeedObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.getMyNewsfeed(credentials.MyID, last_post_ID); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        //Individual Post On Newsfeed
        public NewsfeedDetailObject_ResponseWrapper Post(NewsfeedObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            NewsfeedDetailObject_ResponseWrapper response = new NewsfeedDetailObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.getPostDetails(credentials.MyID, obj.post_ID);
                response.hasLocation = response.result.post_location_latitude != null ? true : false;
            }
            else
            {
                response.isAuthorized = false;
                response.hasLocation = false;
                response.result = null;
            }
            return response;
        }

        public BiteObject_Response Put(BiteObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            BiteObject_Response response = new BiteObject_Response();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.biteThisPost(obj.post_ID, credentials.MyID);
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }

            return response;
        }

        public DeleteObject_ResponseWrapper Delete(string api_key, int foodict_ID, int post_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            DeleteObject_ResponseWrapper response = new DeleteObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.deleteThisPost(credentials.MyID, post_ID); //foodict
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
