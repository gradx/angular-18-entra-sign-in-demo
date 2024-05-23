using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Protocols;
using System.Security.Claims;
using System.Text.Json;
using System.Net.Http;
using System.Net.Http.Headers;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.Audience = builder.Configuration["Jwt:Audience"];

    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true
    };
});


builder.Services.AddAuthorization();

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(builder => builder
    .WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/security/getMessage", () => "Authorized API request successful").RequireAuthorization();

app.MapPost("/security/createToken", [AllowAnonymous] async ([FromBody] JsonDocument jwt, HttpContext context) =>
{
    try
    {
        var entraTokenHandler = new JwtSecurityTokenHandler();
        var entraToken = entraTokenHandler.ReadJwtToken(jwt.RootElement.GetProperty("idToken").GetString());


        var issuer = entraToken.Payload.FirstOrDefault(t => t.Key == "iss").Value; // 9188040d-6c67-4c5b-b112-36a304b66dad == Microsoft tenant
        var audience = entraToken.Payload.FirstOrDefault(t => t.Key == "aud").Value;

        // https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0/.well-known/openid-configuration
        var configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>($"{issuer}/.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
        var openIdConfig = await configurationManager.GetConfigurationAsync(CancellationToken.None);

        var validationParams = new TokenValidationParameters
        {
            IssuerSigningKeys = openIdConfig.SigningKeys,
            ValidateAudience = true,
            ValidAudience = audience.ToString(),
            ValidateIssuer = true,
            ValidIssuer = openIdConfig.Issuer,
        };


        var result = entraTokenHandler.ValidateToken(jwt.RootElement.GetProperty("idToken").GetString(), validationParams, out _);

        var http = new HttpClient();
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", jwt.RootElement.GetProperty("accessToken").GetString()!);

        var profile = http.GetFromJsonAsync<JsonDocument>(new Uri(builder.Configuration["Entra:Graph"]!)).GetAwaiter().GetResult();

        if (profile == null || !entraToken.Issuer.StartsWith(builder.Configuration["Entra:Issuer"]!))
            throw new Exception("");


        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("Id", Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, entraToken.Subject),
                new Claim(JwtRegisteredClaimNames.Email, profile.RootElement.GetProperty("mail").GetString()!),
                new Claim(JwtRegisteredClaimNames.Name, profile.RootElement.GetProperty("displayName").GetString()!),
                new Claim(JwtRegisteredClaimNames.GivenName, profile.RootElement.GetProperty("givenName").GetString()!),
                new Claim(JwtRegisteredClaimNames.FamilyName, profile.RootElement.GetProperty("surname").GetString()!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            }),
            Expires = DateTime.UtcNow.AddMinutes(5),
            Issuer = builder.Configuration["Jwt:Issuer"],
            Audience = builder.Configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new
                SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]!)),
            SecurityAlgorithms.HmacSha512Signature)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = tokenHandler.WriteToken(token);
        var stringToken = tokenHandler.WriteToken(token);

        return Results.Ok(stringToken);
    }
    catch (Exception ex)
    {
        return Results.Unauthorized();
    }
});




app.UseAuthentication();
app.UseAuthorization();

app.Run();
