
import json
import uuid
from datetime import datetime, timezone
from decimal import Decimal

import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("CalculatorHistory")


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
        },
        "body": json.dumps(body)
    }


def lambda_handler(event, context):
    try:
        route_key = event.get("routeKey", "")

        # Retrieve the latest 50 calculations
        if route_key == "GET /history":
            result = table.scan(Limit=50)
            items = result.get("Items", [])

            # If there are more than 50 records, only return 50.
            # Sort the returned records newest first.
            items.sort(
                key=lambda item: item.get("timestamp", ""),
                reverse=True
            )

            return response(200, {
                "message": "Calculation history retrieved successfully",
                "history": items
            })

        # Perform and save a calculation
        body = event.get("body")

        if isinstance(body, str):
            body = json.loads(body)
        elif not isinstance(body, dict):
            body = event

        num1 = Decimal(str(body["num1"]))
        num2 = Decimal(str(body["num2"]))
        operation = body["operation"]

        if not num1.is_finite() or not num2.is_finite():
            raise ValueError("Numbers must be finite")

        if operation == "add":
            result_value = num1 + num2
        elif operation == "subtract":
            result_value = num1 - num2
        elif operation == "multiply":
            result_value = num1 * num2
        elif operation == "divide":
            if num2 == 0:
                return response(400, {
                    "error": "Cannot divide by zero"
                })
            result_value = num1 / num2
        else:
            return response(400, {
                "error": "Invalid operation"
            })

        record = {
            "calculationId": str(uuid.uuid4()),
            "num1": str(num1),
            "num2": str(num2),
            "operation": operation,
            "result": str(result_value),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        table.put_item(Item=record)

        return response(200, {
            "message": "Calculation successful",
            "calculation": record
        })

    except (KeyError, ValueError, ArithmeticError, TypeError):
        return response(400, {
            "error": "Provide valid num1, num2 and operation values"
        })

    except Exception:
        print("Unexpected error while processing request")
        return response(500, {
            "error": "Internal server error"
        })
