using color_blaster_mvc.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace color_blaster_mvc.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            SceneModel model = new SceneModel();
            model.OpeningDialogueTexts = GetTexts("conversations", "script-level-", 200);
            return View(model);
        }

        private List<string> GetTexts(string folder, string fileStart, int levels)
        {
            List<string> texts = new List<string>();
            string absoluteStart = @"C:\Code\color-blaster-mvc\color-blaster-mvc\";
            string pathStart = absoluteStart + @"files\" + folder + @"\" + fileStart;
            for (int i = 0; i < levels; i++)
            {
                string filePath = pathStart + (i + 1) + ".txt";
                try
                {
                    using (StreamReader streamReader = new StreamReader(filePath, Encoding.UTF8))
                    {
                        string result = streamReader.ReadToEnd();
                        texts.Add(result);
                    }
                }
                catch (Exception ex)
                {
                    texts.Add(null);
                }
            }
            return texts;
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}