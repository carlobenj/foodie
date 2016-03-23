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
    public class PromoteController : ApiController
    {
        PromoteModels md = new PromoteModels();
        FoodieToolSet fts = new FoodieToolSet();

        public PromoteObjectGet_ResponseWrapper Get(string api_key, int fooducer_ID, bool isActive)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            PromoteObjectGet_ResponseWrapper response = new PromoteObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.getMyPromotion(fooducer_ID, isActive);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public PromoteObjectPost_ResponseWrapper Post(PromoteObjectPost_Insert obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            PromoteObjectPost_ResponseWrapper response = new PromoteObjectPost_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.createPromo(obj);
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }

        public PromoteObjectPut_ResponseWrapper Put(PromoteObjectPut_Request obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            PromoteObjectPut_ResponseWrapper response = new PromoteObjectPut_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.endPromo(obj.fooducer_ID);
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
