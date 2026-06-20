import * as MuiIcons from "@mui/icons-material";
import { useMemo } from "react";
import MicrosoftTeamsIcon from "../../../icons/wrappers/MicrosoftTeamsIcon";
import SharepointWrappedIcon from "../../../icons/wrappers/SharepointIcon";

export type IconType = keyof typeof iconMap;

export type IconColor = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | 'inherit';

export type IconProps = {
	className?: string;
	icon: IconType;
	color?: IconColor;
	size?: "small" | "medium" | "large" | "inherit";
};

const iconMap = {
	Add: MuiIcons.Add,
	Edit: MuiIcons.Edit,
	Delete: MuiIcons.Delete,
	Search: MuiIcons.Search,
	Close: MuiIcons.Close,
	Save: MuiIcons.Save,
	Upload: MuiIcons.Upload,
	Download: MuiIcons.Download,
	Settings: MuiIcons.Settings,
	Notifications: MuiIcons.Notifications,
	Visibility: MuiIcons.Visibility,
	VisibilityOff: MuiIcons.VisibilityOff,
	Info: MuiIcons.Info,
	Money: MuiIcons.AttachMoney,
	MoreVert: MuiIcons.MoreVert,
	FaceIcon: MuiIcons.Face,
	ArrowBack: MuiIcons.ArrowBack,
	ExpandMore: MuiIcons.ExpandMore,
	NoteAdd: MuiIcons.NoteAdd,
	KeyboardDoubleArrowRight: MuiIcons.KeyboardDoubleArrowRight,
	ArticleOutlined: MuiIcons.ArticleOutlined,
	PlayArrow: MuiIcons.PlayArrow,
	Home: MuiIcons.Home,
	LockOutline: MuiIcons.LockOutlined,
	Assignment: MuiIcons.Assignment,
	GridView: MuiIcons.GridView,
	List: MuiIcons.List,
	Widgets: MuiIcons.Widgets,
	South: MuiIcons.South,
	North: MuiIcons.North,
	Undo: MuiIcons.Undo,
	PersonAdd: MuiIcons.PersonAdd,
	ChevronRight: MuiIcons.ChevronRight,
	HowToReg: MuiIcons.HowToReg,
	SearchOff: MuiIcons.SearchOff,
	Remove: MuiIcons.Remove,
	Check: MuiIcons.Check,
	AttachFile: MuiIcons.AttachFile,
	KeyboardArrowDown: MuiIcons.KeyboardArrowDown,
	KeyboardArrowUp: MuiIcons.KeyboardArrowUp,
	ErrorOutline: MuiIcons.ErrorOutlined,
	AppRegistration: MuiIcons.AppRegistration,
	SettingsApplications: MuiIcons.SettingsApplications,
	Code: MuiIcons.Code,
	Store: MuiIcons.Store,
	Insights: MuiIcons.Insights,
	Dashboard: MuiIcons.Dashboard,
	FolderShared: MuiIcons.FolderShared,
	Reviews: MuiIcons.Reviews,
	CommentBank: MuiIcons.CommentBank,
	AddBox: MuiIcons.AddBox,
	ContentCopy: MuiIcons.ContentCopy,
	Lightbulb: MuiIcons.Lightbulb,
	LightbulbCircle: MuiIcons.LightbulbCircle,
	WarningAmberOutlined: MuiIcons.WarningAmberOutlined,
	Policy: MuiIcons.Policy,
	AccountBalance: MuiIcons.AccountBalance,
	CloudUpload: MuiIcons.CloudUpload,
	QuestionAnswerOutlined: MuiIcons.QuestionAnswerOutlined,
	AnalyticsOutlined: MuiIcons.AnalyticsOutlined,
	ArrowDropDown: MuiIcons.ArrowDropDown,
	ArrowDropUp: MuiIcons.ArrowDropUp,
	UnfoldMore: MuiIcons.UnfoldMore,
	CloseFullscreen: MuiIcons.CloseFullscreen,
	OpenInFull: MuiIcons.OpenInFull,
	BarChart: MuiIcons.BarChart,
	ViewKanban: MuiIcons.ViewKanban,
	WarningAmber: MuiIcons.WarningAmber,
	AddCard: MuiIcons.AddCard,
	CopyAll: MuiIcons.CopyAll,
	Public: MuiIcons.Public,
	Assessment: MuiIcons.Assessment,
	CheckCircleOutlineOutlined : MuiIcons.CheckCircleOutlineOutlined,
	Cancel: MuiIcons.Cancel,
	Link: MuiIcons.Link,
	People: MuiIcons.People,
	Description: MuiIcons.Description,
	Storage: MuiIcons.Storage,
	CalendarToday: MuiIcons.CalendarToday,
	FormatListBulleted: MuiIcons.FormatListBulleted,
	InfoOutlined: MuiIcons.InfoOutlined,
	TableRowsOutlined: MuiIcons.TableRowsOutlined,
	ViewKanbanOutlined: MuiIcons.ViewKanbanOutlined,
	close: MuiIcons.Close,
	OpenInNew: MuiIcons.OpenInNew,
	Menu: MuiIcons.Menu,
	DarkMode: MuiIcons.DarkMode,
	LightMode: MuiIcons.LightMode,
	Task: MuiIcons.Task,
	Approval: MuiIcons.Approval,
	Feedback: MuiIcons.Feedback,
	Support: MuiIcons.Support,
	UserIcon: MuiIcons.AccountCircle,
	Tag: MuiIcons.Tag,
	Help: MuiIcons.Help,
	Logout: MuiIcons.Logout,
	BuildCircle: MuiIcons.BuildCircle,
	WorkspacePremium: MuiIcons.WorkspacePremium,
	LinkOutlined: MuiIcons.LinkOutlined,
	FilterAlt: MuiIcons.FilterAlt,
	MoreHoriz: MuiIcons.MoreHoriz,
	MarkEmailRead: MuiIcons.MarkEmailRead,
	MarkEmailUnread: MuiIcons.MarkEmailUnread,
	SchemaOutlined: MuiIcons.SchemaOutlined,
	CameraAltOutlined: MuiIcons.CameraAltOutlined,
	MonitorHeartOutlined: MuiIcons.MonitorHeartOutlined,
	ChevronLeft: MuiIcons.ChevronLeft,
	SmartToyOutlined: MuiIcons.SmartToyOutlined,
	ChatOutlined: MuiIcons.ChatOutlined,
	CheckCircleOutline: MuiIcons.CheckCircleOutlined,
	CancelOutlined: MuiIcons.CancelOutlined,
	DataObjectOutlined: MuiIcons.DataObjectOutlined,
	FiberManualRecord: MuiIcons.FiberManualRecord,
	TuneOutlined: MuiIcons.TuneOutlined,
	AccessTimeOutlined: MuiIcons.AccessTimeOutlined,
	CalendarTodayOutlined: MuiIcons.CalendarTodayOutlined,
	CategoryOutlined: MuiIcons.CategoryOutlined,
	Refresh: MuiIcons.Refresh,
	Rocket: MuiIcons.Rocket,
	RocketLaunch: MuiIcons.RocketLaunch,
	FolderZip: MuiIcons.FolderZip,
	Notes: MuiIcons.Notes,
	Dataset: MuiIcons.Dataset,
	Cable: MuiIcons.Cable,
	AutoAwesome: MuiIcons.AutoAwesome,
	LocalShipping: MuiIcons.LocalShipping,
	Inventory: MuiIcons.Inventory,
	Speed: MuiIcons.Speed,
	ElectricalServices: MuiIcons.ElectricalServices,
	Person: MuiIcons.Person,
	AdminPanelSettings: MuiIcons.AdminPanelSettings,
	ExpandLess: MuiIcons.ExpandLess,
	DeleteOutline: MuiIcons.DeleteOutlined,
	Send: MuiIcons.Send,
	Monitor: MuiIcons.Monitor,
	LocationOnOutlined: MuiIcons.LocationOnOutlined,
	PersonOutline: MuiIcons.PersonOutlined,
	DoDisturb: MuiIcons.DoDisturb,
	WarningAmberIcon: MuiIcons.WarningAmber,
	ArrowForward: MuiIcons.ArrowForward,
	AccountTree: MuiIcons.AccountTree,
	Subscriptions: MuiIcons.Subscriptions,
	ReportGmailerrorred : MuiIcons.ReportGmailerrorred,
	SwapVert: MuiIcons.SwapVert,
	Analytics: MuiIcons.Analytics,
	Upgrade: MuiIcons.Upgrade,
	Share: MuiIcons.Share,
	FileUpload: MuiIcons.FileUpload,
	DoneOutlined: MuiIcons.DoneOutlined,
	SharepointIcon: SharepointWrappedIcon,
	MicrosoftTeams: MicrosoftTeamsIcon,
	HealthAndSafety: MuiIcons.HealthAndSafety,
	MonitorHeart: MuiIcons.MonitorHeart,
	Scale: MuiIcons.Scale,
	Palette: MuiIcons.Palette,
	Lock: MuiIcons.Lock,
	Shield: MuiIcons.Shield,
	Security: MuiIcons.Security,
	Category: MuiIcons.Category,
	PlayCircleOutlineIcon: MuiIcons.PlayCircleOutlined,
	CheckCircleOutlineIcon: MuiIcons.CheckCircleOutlineOutlined,
	PauseCircleOutlineIcon: MuiIcons.PauseCircleOutlined
} as const;

const Icon = (props: IconProps) => {

	const color = useMemo(() => {
		switch (props.color) {
			case "default":
				return "action";
			default:
				return props.color;
		}
	}, [props.color]);

	const Component = iconMap[props.icon];
	if (!Component)
		throw new Error(`Icon type ${props.icon} not implemented`);

	return (
		<Component
			className={props.className}
			color={color}
			fontSize={props.size}
		/>
	);
};

export default Icon;