const { NodeSDK } = require("@opentelemetry/sdk-node");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
  ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
const opentelemetry = require("@opentelemetry/api");

const ignore_routes = (req) => {
  const pathsToIgnore = ["/health", "/metrics"];
  return pathsToIgnore.includes(req.url);
};

const provider = new NodeTracerProvider();
const exporter = new PrometheusExporter({ port: 9464 });
const sdk = new NodeSDK({
  metricReader: exporter,
  instrumentations: [
    // Express instrumentation expects HTTP layer to be instrumented
    new HttpInstrumentation({ ignoreIncomingRequestHook: ignore_routes }),
    new ExpressInstrumentation(),
  ],
});

sdk.start();
provider.register();

const meter = opentelemetry.metrics.getMeter(
  "instrumentation-scope-name",
  "instrumentation-scope-version",
);
const validate_error_counter = meter.createCounter("validate_error_total", {
  description: "Total number of validation errors",
});

const count_error = function (error) {
  validate_error_counter.add(1, { type: error.type });
  return error;
};

module.exports = { count_error };
