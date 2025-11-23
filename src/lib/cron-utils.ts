import { CronExpressionParser } from "cron-parser";


export function getNextCronDate(
    cronExpression: string,
    timezone: string = "UTC"
): Date {
    const cron = CronExpressionParser.parse(cronExpression, {
        tz: timezone,
    });
    return cron.next().toDate();
}

