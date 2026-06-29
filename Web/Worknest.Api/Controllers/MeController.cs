using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Worknest.Api.Controllers.Base;
using Worknest.Application.Features.Employee;
using Worknest.Application.Features.Employee.Queries;

namespace Worknest.Api.Controllers;

[Route("api/employee/me")]
public class MeController : BaseController
{
    [HttpGet]
    [ProducesResponseType(typeof(CurrentUserContextDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentProfile()
    {
        return (await Mediator.Send(new GetMyProfileQuery()))
            .Match(Ok, Problem);
    }
}
