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
    public class ValidateController : ApiController
    {
        ValidateModels md = new ValidateModels();
        FoodieToolSet fts = new FoodieToolSet();
        public ValidateObjectGet_ResponseWrapper Get(string api_key, int fooducer_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            ValidateObjectGet_ResponseWrapper response = new ValidateObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.getValidateTiles(fooducer_ID);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }
        public ValidateObjectPost_ResponseWrapper Post(ValidateObjectPost_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            ValidateObjectPost_ResponseWrapper response = new ValidateObjectPost_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.getPromo(obj.fooducer_ID, obj.offer_ID);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }
        public ValidateObjectPut_ResponseWrapper Put(ValidateObjectPut_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            ValidateObjectPut_ResponseWrapper response = new ValidateObjectPut_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.validateCode(obj.offer_ID, obj.fooducer_ID, obj.voucher_code);
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
