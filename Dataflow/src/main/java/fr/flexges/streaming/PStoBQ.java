package fr.flexges.streaming;

import com.google.api.client.util.Base64;
import com.google.api.services.bigquery.model.TableFieldSchema;
import com.google.api.services.bigquery.model.TableRow;
import com.google.api.services.bigquery.model.TableSchema;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import javafx.scene.control.Tab;
import org.apache.avro.generic.GenericRecord;
import org.apache.beam.sdk.Pipeline;
import org.apache.beam.sdk.extensions.gcp.options.GcpOptions;
import org.apache.beam.sdk.io.gcp.bigquery.BigQueryIO;
import org.apache.beam.sdk.io.gcp.pubsub.PubsubIO;
import org.apache.beam.sdk.io.gcp.pubsub.PubsubMessage;
import org.apache.beam.sdk.options.Default;
import org.apache.beam.sdk.options.Description;
import org.apache.beam.sdk.options.PipelineOptions;
import org.apache.beam.sdk.options.PipelineOptionsFactory;
import org.apache.beam.sdk.transforms.*;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.ArrayList;
import java.util.List;


public class PStoBQ {

    public static void main(String[] args) {
        Logger logger = LoggerFactory.getLogger(PStoBQ.class);
        PipelineOptionsFactory.register(GcpOptions.class);
        PipelineOptions options = PipelineOptionsFactory
                .fromArgs(args)
                .withValidation()
                .create();

        Pipeline pipeline = Pipeline.create(options);


        // Build the table schema for the output table.
        List<TableFieldSchema> fields = new ArrayList<>();
        fields.add(new TableFieldSchema().setName("enterpriseId").setType("STRING"));
        fields.add(new TableFieldSchema().setName("enterpriseName").setType("STRING"));
        fields.add(new TableFieldSchema().setName("roomId").setType("STRING"));
        fields.add(new TableFieldSchema().setName("roomName").setType("STRING"));
        fields.add(new TableFieldSchema().setName("actionDate").setType("TIMESTAMP"));
        fields.add(new TableFieldSchema().setName("event").setType("STRING"));
        fields.add(new TableFieldSchema().setName("email").setType("STRING"));
        fields.add(new TableFieldSchema().setName("insertDate").setType("TIMESTAMP"));

        TableSchema schema = new TableSchema().setFields(fields);

        pipeline
                .apply(PubsubIO.readMessagesWithAttributes().fromTopic("projects/projetannuel-309416/topics/projetannuel-309416-topic-firestore"))
                .apply("ConvertDataToTableRows", ParDo.of(new DoFn<PubsubMessage, TableRow>() {
                    @ProcessElement
                    public void processElement(ProcessContext c) {
                        PubsubMessage message = c.element();
                        assert message != null;

                        try {
                            Gson gson = new Gson();
                            JsonElement jsonElement = gson.toJsonTree(message.getAttributeMap());

                            PubsubMsg pubsubMsg = gson.fromJson(jsonElement, PubsubMsg.class);
                            TableRow row = new TableRow()
                                    .set("enterpriseName", pubsubMsg.getEnterpriseName())
                                    .set("roomId", pubsubMsg.getRoomId())
                                    .set("enterpriseId", pubsubMsg.getEnterpriseId())
                                    .set("roomName", pubsubMsg.getRoomName())
                                    .set("email", pubsubMsg.getEmail())
                                    .set("event", pubsubMsg.getEvent())
                                    .set("actionDate", pubsubMsg.getActionDate())
                                    .set("insertDate", (long) (c.timestamp().getMillis()/1000));

                            logger.info(pubsubMsg.toString());
                            c.output(row);
                        }catch(Exception e){
                            logger.error(e.getMessage(), message.toString());
                        }

                    }
                }))
                .apply("InsertTableRowsToBigQuery",
                        BigQueryIO.writeTableRows().to("bqd_flexges.move_in_out_fact")
                                .withSchema(schema)
                                .withCreateDisposition(BigQueryIO.Write.CreateDisposition.CREATE_NEVER)
                                .withWriteDisposition(BigQueryIO.Write.WriteDisposition.WRITE_APPEND));

        // Run the pipeline
        pipeline.run();
    }
}