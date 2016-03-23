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
    public class InappropriateController : ApiController
    {
        InappropriateModels md = new InappropriateModels();
        FoodieToolSet fts = new FoodieToolSet();

        public InappropriateObjectGet_ResponseWrapper Get(string api_key, int administrator_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            InappropriateObjectGet_ResponseWrapper response = new InappropriateObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == administrator_ID)
            {
                response.isAuthorized = true;
                response.result = md.getInappropriate();
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }


        public InappropriateObjectPost_ResponseWrapper Post(InappropriateObjectPost_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            InappropriateObjectPost_ResponseWrapper response = new InappropriateObjectPost_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.administrator_ID)
            {
                response.isAuthorized = true;
                response.result = md.getReport(obj.report_ID, obj.report_type);
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
