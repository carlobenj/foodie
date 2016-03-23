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
    public class OffensiveController : ApiController
    {
        OffensiveModels md = new OffensiveModels();
        FoodieToolSet fts = new FoodieToolSet();
        public OffensiveObjectGet_ResponseWrapper Get(string api_key, int administrator_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            OffensiveObjectGet_ResponseWrapper response = new OffensiveObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == administrator_ID)
            {
                response.isAuthorized = true;
                response.result = md.getOffensive();
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public OffensiveObjectPost_ResponseWrapper Post(OffensiveObjectPost_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            OffensiveObjectPost_ResponseWrapper response = new OffensiveObjectPost_ResponseWrapper();
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

        public OffensiveObjectPut_ResponseWrapper Put(OffensiveObjectPut_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            OffensiveObjectPut_ResponseWrapper response = new OffensiveObjectPut_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.administrator_ID)
            {
                response.isAuthorized = true;
                response.result = md.penalty(obj.report_ID, obj.report_source_item_ID, obj.report_type, obj.penalty_amount);
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }

        public OffensiveObjectDelete_ResponseWrapper Delete(string api_key, int administrator_ID, int report_ID, int report_source_item_ID, int report_type)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            OffensiveObjectDelete_ResponseWrapper response = new OffensiveObjectDelete_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == administrator_ID)
            {
                response.isAuthorized = true;
                response.result = md.delete(report_ID, report_source_item_ID, report_type);
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
