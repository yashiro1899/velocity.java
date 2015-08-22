import java.io.*;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class ServerHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        OutputStream os = exchange.getResponseBody();
        InputStream is  = exchange.getRequestBody();

        String res = "";
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            byte buf[] = new byte[4096];
            for (int n = is.read(buf); n > 0; n = is.read(buf)) {
                baos.write(buf, 0, n);
            }

            String json = new String(baos.toByteArray(), "UTF-8");
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode node = (ObjectNode)mapper.readTree(json);

            res = VelocityCli.render(node);
            exchange.sendResponseHeaders(200, 0);
        } catch(Exception e) {
            res = e.getMessage();
            res += "\n";
            exchange.sendResponseHeaders(500, 0);
        } finally {
            os.write(res.getBytes());
            os.close();
            is.close();
        }
    }
}
