import connectDB from '@/lib/mongoose';
import SiteSettings from '@/lib/models/SiteSettings';

export async function getSiteSetting(key: string, defaultValue: any = null) {
  try {
    await connectDB();
    const setting = await SiteSettings.findOne({ settingKey: key });
    return setting ? setting.settingValue : defaultValue;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return defaultValue;
  }
}

export async function isMaintenanceMode(): Promise<boolean> {
  return await getSiteSetting('maintenanceMode', false);
}

export async function isPremiumPurchaseEnabled(): Promise<boolean> {
  return await getSiteSetting('premiumPurchaseEnabled', true);
}
