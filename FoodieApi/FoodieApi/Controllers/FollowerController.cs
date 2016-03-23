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
    public class FollowerController : ApiController
    {
        FollowerModels md = new FollowerModels();
        FoodieToolSet fts = new FoodieToolSet();

        public FollowerObject_ResponseWrapper Get(string api_key, int foodict_ID, int target_foodict_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            FollowerObject_ResponseWrapper response = new FollowerObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getFollower(credentials.MyID, target_foodict_ID); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }
    }
}
