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
    public class DashboardController : ApiController
    {
        DashboardModels md = new DashboardModels();
        FoodieToolSet fts = new FoodieToolSet();

        public DashboardObjectGet_ResponseWrapper Get(string api_key, int fooducer_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            DashboardObjectGet_ResponseWrapper response = new DashboardObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.getMyDashboard(credentials.MyID);
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
