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
    public class ReportController : ApiController
    {
        ReportModels md = new ReportModels();
        FoodieToolSet fts = new FoodieToolSet();

        public ReportObject_PostResponseWrapper Post(ReportObject_Post obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            ReportObject_PostResponseWrapper response = new ReportObject_PostResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.sendReport(obj); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }

        public ReportObjectDelete_ResponseWrapper Delete(string api_key, int administrator_ID, int report_source_item_ID, int report_type)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            ReportObjectDelete_ResponseWrapper response = new ReportObjectDelete_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == administrator_ID)
            {
                response.isAuthorized = true;
                response.result = md.deleteReport(report_source_item_ID, report_type);
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
