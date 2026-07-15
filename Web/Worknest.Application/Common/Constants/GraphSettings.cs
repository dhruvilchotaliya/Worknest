namespace Worknest.Application.Common.Constants
{
    /// <summary>
    /// Configuration model for Microsoft Graph API settings.
    /// Bound from appsettings.json section "MicrosoftGraph".
    /// </summary>
    public class GraphSettings
    {
        public const string SectionName = "MicrosoftGraph";

        /// <summary>
        /// The Azure AD tenant ID where guest users will be invited.
        /// </summary>
        public string TenantId { get; set; } = string.Empty;

        /// <summary>
        /// The app registration's Client ID (same as your API's ClientId).
        /// Used to look up the service principal and app roles.
        /// </summary>
        public string ClientId { get; set; } = string.Empty;

        /// <summary>
        /// Client secret for app-only (client credentials) authentication to Graph API.
        /// NEVER commit this to source control — use User Secrets or Key Vault.
        /// </summary>
        public string ClientSecret { get; set; } = string.Empty;

        /// <summary>
        /// The default app role name assigned to newly invited guest users.
        /// Must match an App Role value defined in the Azure AD app registration.
        /// </summary>
        public string DefaultAppRoleName { get; set; } = RoleConstants.User;

        /// <summary>
        /// The URL where the user is redirected after redeeming the B2B invitation.
        /// Typically your frontend's URL (e.g., http://localhost:5173).
        /// </summary>
        public string InviteRedirectUrl { get; set; } = string.Empty;

        /// <summary>
        /// Whether to send the default Microsoft invitation email to the guest.
        /// If false, you handle the redemption flow within your app using the inviteRedeemUrl.
        /// </summary>
        public bool SendInvitationEmail { get; set; } = false;
    }
}
