using Entities.Dtos.Other;
using Entities.Models;
using Logic.Logic;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EdushareBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController:ControllerBase
    {

        StatisticsLogic statisticsLogic;

        public StatisticsController(StatisticsLogic statisticsLogic)
        {
            this.statisticsLogic = statisticsLogic;
        }

        [HttpGet("GetAdminStatisctics")]
        public AdminStatisticsDto GetAdminStatistics()
        {
            return statisticsLogic.GetAdminStatistics();
        }

        [HttpGet("GetHomePageStatistics")]
        public HomePageStatisticsDto GetHomePageStatistics()
        {
            return statisticsLogic.GetHomePageStatistics();
        }

        [HttpGet("GetUserStatistics/{userId}")]
        public UserStatisticsDto GetUserStatistics(string userId)
        {
            return statisticsLogic.GetUserStatistics(userId);
        }
    }
}
