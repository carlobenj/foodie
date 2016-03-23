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
    public class FooducerAccountController : ApiController
    {
        FooducerAccountModels md = new FooducerAccountModels();
        FoodieToolSet fts = new FoodieToolSet();

        public FooducerAccountObject_ResponseWrapper Post(FooducerAccountObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            FooducerAccountObject_ResponseWrapper response = new FooducerAccountObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.getMyAccount(obj.user_ID, obj.fooducer_ID); //fooducer
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public FooducerEditAccountObject_ResponseWrapper Put(FooducerEditAccountObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            FooducerEditAccountObject_ResponseWrapper response = new FooducerEditAccountObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.editMyAccount(obj); //foodict
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
