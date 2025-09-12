using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        TestLogic logic;

        public TestController(TestLogic logic)
        {
            this.logic = logic;
        }

        [HttpGet]
        public Test GetTest()
        {
            return logic.GetTest();
        }
    }
}
