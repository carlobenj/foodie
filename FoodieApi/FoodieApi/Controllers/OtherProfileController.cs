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
    public class OtherProfileController : ApiController
    {
        OtherProfileModels md = new OtherProfileModels();
        FoodieToolSet fts = new FoodieToolSet();

        public ProfileObject_ResponseWrapper Get(string api_key, int foodict_ID, int target_foodict_ID) 
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            ProfileObject_ResponseWrapper response = new ProfileObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getThisFoodictProfile(credentials.MyID, target_foodict_ID); //other foodict
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
