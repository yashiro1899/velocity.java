import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Properties;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.apache.velocity.context.Context;

import org.apache.velocity.tools.ToolManager;
import org.apache.velocity.tools.config.ConfigurationUtils;
import org.apache.velocity.tools.config.EasyFactoryConfiguration;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;

public class VelocityCli {

    static final String VJ_SERVER_PORT = "velocity.java.server.port";
    static final String VJ_LOADER_PATH = "velocity.java.loader.path";
    static final String VJ_FILENAME    = "velocity.java.filename";

    private static LinkedHashMap<String, LinkedHashMap<String, Object>> engineMap;
    private static VelocityEngine engine;
    private static Context baseContext;

    private static Object convert(JsonNode node) {
        switch (node.getNodeType()) {
            case ARRAY:
                ArrayList<Object> a = new ArrayList<Object>();
                Iterator<JsonNode> ita = node.elements();

                for (; ita.hasNext(); ) a.add(convert(ita.next()));
                return a;

            case BOOLEAN:
                return node.booleanValue();

            case OBJECT:
                LinkedHashMap<String, Object> o = new LinkedHashMap<String, Object>();
                Iterator<String> ito = node.fieldNames();

                for (; ito.hasNext(); ) {
                    String field = (String)ito.next();
                    o.put(field, convert(node.get(field)));
                }
                return o;

            case NULL:
                return null;

            case NUMBER:
                return node.numberValue();

            case STRING:
                return node.textValue();
        }

        return node;
    }

    private static Properties createProperties(String loaderPath) {
        File f = new File(loaderPath, "velocity.properties");
        Properties prop = new Properties();

        if (f.exists()) {
            try {
                InputStream in = new BufferedInputStream(new FileInputStream(f));
                prop.load(in);
            } catch(Exception e) {
                System.err.println(e.getMessage());
                System.exit(1);
            }
        } else {
            prop.setProperty("input.encoding", "UTF-8");
            prop.setProperty("output.encoding", "UTF-8");
            prop.setProperty("runtime.log.logsystem.class",
                    "org.apache.velocity.runtime.log.NullLogChute");
            prop.setProperty("file.resource.loader.cache", "true");
            prop.setProperty("file.resource.loader.modificationCheckInterval", "2");
            prop.setProperty("resource.manager.defaultcache.size", "0");
        }
        prop.setProperty("file.resource.loader.path", loaderPath);

        return prop;
    }

    private static Context createContext(String loaderPath) {
        File f = new File(loaderPath, "tools.xml");
        ToolManager manager = new ToolManager();

        if (f.exists()) {
            try {
                manager.configure(ConfigurationUtils.find(f.getCanonicalPath()));
            } catch(Exception e) {
                System.err.println(e.getMessage());
                System.exit(1);
            }
        } else {
            EasyFactoryConfiguration config = new EasyFactoryConfiguration();
            config.autoLoad();
            manager.configure(config);
        }

        return manager.createContext();
    }

    private static void setEngine(String loaderPath) {
        LinkedHashMap<String, Object> m = engineMap.get(loaderPath);

        if (m == null) {
            engine = new VelocityEngine();
            engine.init(createProperties(loaderPath));
            baseContext = createContext(loaderPath);

            m = new LinkedHashMap<String, Object>();
            m.put("engine", engine);
            m.put("context", baseContext);
            engineMap.put(loaderPath, m);
        } else {
            engine = (VelocityEngine)m.get("engine");
            baseContext = (Context)m.get("context");
        }
    }

    public static String render(ObjectNode node) throws Exception {
        if (!node.has(VJ_FILENAME)) {
            throw new Exception("Must have \"" + VJ_FILENAME + "\" parameter!");
        }
        String filename = node.get(VJ_FILENAME).textValue();
        node.remove(VJ_FILENAME);

        String loaderPath;
        if (node.has(VJ_LOADER_PATH)) {
            loaderPath = node.get(VJ_LOADER_PATH).textValue();
            node.remove(VJ_LOADER_PATH);
        } else {
            loaderPath = System.getProperty("user.dir");
        }
        setEngine(loaderPath);

        Context context = new VelocityContext(baseContext);
        Iterator<String> it = node.fieldNames();

        for (; it.hasNext(); ) {
            String field = (String)it.next();
            context.put(field, convert(node.get(field)));
        }

        StringWriter writer = new StringWriter();
        engine.getTemplate(filename).merge(context, writer);
        return writer.toString();
    }

    public static void main(String[] args) throws Exception {
        if (args.length > 0) {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode node = (ObjectNode)mapper.readTree(args[0]);

            engineMap = new LinkedHashMap<String, LinkedHashMap<String, Object>>();
            if (node.has(VJ_SERVER_PORT)) {
                int port = node.get(VJ_SERVER_PORT).numberValue().intValue();
                HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
                server.createContext("/", new ServerHandler());
                server.start();
                return;
            }

            System.out.println(render(node));
        } else {
            System.err.println(
                    "Usage: java -jar velocity-cli.jar \\\n" +
                    "'\n{\n" +
                    "    \"velocity.java.loader.path\": \"/path/to/root\"\n" +
                    "    \"velocity.java.filename\": \"filename\"\n" +
                    "    \"data1\": \"...\"\n" +
                    "    \"data2\": \"...\"\n" +
                    "}'");
        }
    }
}
