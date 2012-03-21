package fr.ippon.tatami.service;

import static java.lang.System.currentTimeMillis;
import static org.joda.time.PeriodType.dayTime;

import java.util.Date;

import org.joda.time.Period;
import org.joda.time.format.PeriodFormatter;
import org.joda.time.format.PeriodFormatterBuilder;

public class PrettyDateUtil {
    private static PeriodFormatter dayFormatter = new PeriodFormatterBuilder().appendDays().appendSuffix("d").toFormatter();

    private static PeriodFormatter hourFormatter = new PeriodFormatterBuilder().appendHours().appendSuffix("h").toFormatter();

    private static PeriodFormatter minuteFormatter = new PeriodFormatterBuilder().appendMinutes().appendSuffix("m").toFormatter();

    private static PeriodFormatter secondFormatter = new PeriodFormatterBuilder().appendSeconds().appendSuffix("s").toFormatter();

    public static String prettyPrint(Date date) {
        Period period = new Period(date.getTime(), currentTimeMillis(), dayTime());

        if (period.getDays() > 0) {
            return dayFormatter.print(period);
        } else if (period.getHours() > 0) {
            return hourFormatter.print(period);
        } else if (period.getMinutes() > 0) {
            return minuteFormatter.print(period);
        } else {
            return secondFormatter.print(period);
        }
    }
}
