import java.io.*;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class ServerHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.sendResponseHeaders(200, 0);

        OutputStream os = exchange.getResponseBody();
        InputStream is  = exchange.getRequestBody();

        try {
            byte buf[] = new byte[4096];
            for (int n = is.read(buf); n > 0; n = is.read(buf)) {
                os.write(buf, 0, n);
            }
        } finally {
            is.close();
            os.close();
        }
    }
}
