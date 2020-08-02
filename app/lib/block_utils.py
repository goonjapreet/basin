import os
import pyspark.sql
import common.utils
import os
import pyspark.sql
import common.utils
import os
import pyspark.sql
import common.utils


def extract(spark,env,source):
    catalog = common.utils.get_catalog()
    print(catalog)
    properties = catalog[source]
    options = {
        "inferSchema": True,
        "quote": "\"",
        "escape": "\"",
        "multiLine": "true",
        "mode":"DROPMALFORMED",
        "ignoreTrailingWhiteSpace": True,
        "ignoreLeadingWhiteSpace": True,
    }
    options["delimiter"] = properties["delimiter"]
    options["header"] = properties["header"]
    df = spark.read.options(**options).csv(os.path.join(env["datafolder"],properties["location"]))
    return df


def ef_date(spark,env,df,connection,format,location,column_mapping):
    # catalog = common.utils.get_catalog()
    # print(catalog)
    # properties = catalog[source]
    options = {
        "quote": "\"",
        "escape": "\"",
        "multiLine": "true",
    }
    # options["delimiter"] = properties["delimiter"]
    # options["header"] = properties["header"]
    if format=='csv':
        df.toPandas().to_csv(os.path.join(env["datafolder"],location),index=False)
    else:
        df.write.parquet(os.path.join(env["datafolder"],location))
        


def load(spark,env,df,connection,format,location,column_mapping):
    # catalog = common.utils.get_catalog()
    # print(catalog)
    # properties = catalog[source]
    options = {
        "quote": "\"",
        "escape": "\"",
        "multiLine": "true",
    }
    # options["delimiter"] = properties["delimiter"]
    # options["header"] = properties["header"]
    if format=='csv':
        df.toPandas().to_csv(os.path.join(env["datafolder"],location),index=False)
    else:
        df.write.parquet(os.path.join(env["datafolder"],location))
        

