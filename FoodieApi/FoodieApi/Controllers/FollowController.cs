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
    public class FollowController : ApiController
    {
        FollowModels md = new FollowModels();
        FoodieToolSet fts = new FoodieToolSet();
        public FollowObject_ResponseWrapper Post(FollowObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            FollowObject_ResponseWrapper response = new FollowObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.source_foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.followThisFoodict(obj.source_foodict_ID, obj.target_foodict_ID); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }


        //to accept or reject follower request
        public FollowObjectPut_ResponseWrapper Put(FollowObjectPut_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            FollowObjectPut_ResponseWrapper response = new FollowObjectPut_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.actionRequest(obj.notification_ID, obj.follow_ID, obj.isAccepted); //action on follow request
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }

        public UnfollowObject_ResponseWrapper Delete(string api_key, int source_foodict_ID, int target_foodict_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            UnfollowObject_ResponseWrapper response = new UnfollowObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.unfollowThisFoodict(source_foodict_ID, target_foodict_ID); //foodict
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
