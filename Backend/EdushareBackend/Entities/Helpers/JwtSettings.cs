namespace Entities.Helpers;

public class JwtSettings
{
    public string Issuer { get; set; } = string.Empty;
    public string Key { get; set; }  = string.Empty;
}