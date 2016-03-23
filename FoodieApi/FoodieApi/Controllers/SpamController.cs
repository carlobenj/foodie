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
    public class SpamController : ApiController
    {
        SpamModels md = new SpamModels();
        FoodieToolSet fts = new FoodieToolSet();

        public SpamObjectGet_ResponseWrapper Get(string api_key, int administrator_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            SpamObjectGet_ResponseWrapper response = new SpamObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == administrator_ID)
            {
                response.isAuthorized = true;
                response.result = md.getSpams();
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public SpamObjectPost_ResponseWrapper Post(SpamObjectPost_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            SpamObjectPost_ResponseWrapper response = new SpamObjectPost_ResponseWrapper();
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

        public SpamObjectPut_ResponseWrapper Put(SpamObjectPut_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            SpamObjectPut_ResponseWrapper response = new SpamObjectPut_ResponseWrapper();
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

        public SpamObjectDelete_ResponseWrapper Delete(string api_key, int administrator_ID, int report_ID, int report_source_item_ID, int report_type)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            SpamObjectDelete_ResponseWrapper response = new SpamObjectDelete_ResponseWrapper();
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
