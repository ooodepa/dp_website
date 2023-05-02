const AppEnv = {
  NEXT_PUBLIC__BACKEND_URL: process.env.NEXT_PUBLIC__BACKEND_URL as string,
  NEXT_PUBLIC__SITE_TITLE: process.env.NEXT_PUBLIC__SITE_TITLE as string,
  NEXT_PUBLIC__SITE_DATE: process.env.NEXT_PUBLIC__SITE_DATE as string,
  NEXT_PUBLIC__SITE_GOOGLE_MAP_PB: process.env
    .NEXT_PUBLIC__SITE_GOOGLE_MAP_PB as string,
};

export default AppEnv;
