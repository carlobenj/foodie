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
    public class VoucherController : ApiController
    {
        VoucherModels md = new VoucherModels();
        FoodieToolSet fts = new FoodieToolSet();

        public VoucherObjectGet_ResponseWrapper Get(string api_key, int foodict_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            VoucherObjectGet_ResponseWrapper response = new VoucherObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getMyVouchers(credentials.MyID); 
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public VoucherObjectDelete_ResponseWrapper Delete(string api_key, int foodict_ID, int voucher_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            VoucherObjectDelete_ResponseWrapper response = new VoucherObjectDelete_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.deleteVoucher(credentials.MyID, voucher_ID);
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
