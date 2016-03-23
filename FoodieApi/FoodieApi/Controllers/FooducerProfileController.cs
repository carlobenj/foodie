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
    public class FooducerProfileController : ApiController
    {
        FooducerProfileModels md = new FooducerProfileModels();
        FoodieToolSet fts = new FoodieToolSet();

        public FooducerProfileObjectGet_ResponseWrapper Get(string api_key, int fooducer_ID, int foodict_ID = 0)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            FooducerProfileObjectGet_ResponseWrapper response = new FooducerProfileObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.getProfile(fooducer_ID, foodict_ID);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public FooducerProfileEditObject_ResponseWrapper Put(FooducerProfileEditObject_Request obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            FooducerProfileEditObject_ResponseWrapper response = new FooducerProfileEditObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.editMyProfileDetails(obj);
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
