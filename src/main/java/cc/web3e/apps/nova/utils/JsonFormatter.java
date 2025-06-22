package cc.web3e.apps.nova.utils;

import com.google.protobuf.Message;
import com.google.protobuf.MessageOrBuilder;
import com.google.protobuf.util.JsonFormat;
import org.jboss.logging.Logger;

public class JsonFormatter {

    private static final Logger log = Logger.getLogger(JsonFormatter.class);

    public static <T extends Message> String toJson(T obj) {
        try {
            return JsonFormat
                    .printer()
                    .includingDefaultValueFields()
                    .omittingInsignificantWhitespace()
                    .print(obj);
        } catch (Exception e) {
            log.error("Error converting Proto to json", e);
            throw new RuntimeException("Error converting Proto to json", e);
        }
    }

    @SuppressWarnings({"unchecked"})
    public static <T extends MessageOrBuilder> T toProto(String json, Class<T> clazz) {
        Message.Builder builder = null;
        try {
            builder = (Message.Builder) clazz.getMethod("newBuilder").invoke(null);

            JsonFormat.parser().ignoringUnknownFields().merge(json, builder);

            return (T) builder.build();
        } catch (Exception e) {
            log.error("Error converting Proto to proto", e);
            throw new RuntimeException("Error converting Json to proto", e);
        }
    }
}
