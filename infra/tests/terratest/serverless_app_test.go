package terratest

import (
    "path/filepath"
    "testing"

    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/stretchr/testify/require"
)

func TestServerlessAppModule(t *testing.T) {
    t.Parallel()

    terraformDir := filepath.Join("fixtures", "serverless")

    terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
        TerraformDir: terraformDir,
    })

    defer terraform.Destroy(t, terraformOptions)

    terraform.InitAndApply(t, terraformOptions)

    apiInvokeURL := terraform.Output(t, terraformOptions, "api_invoke_url")
    require.NotEmpty(t, apiInvokeURL)

    queueURL := terraform.Output(t, terraformOptions, "queue_url")
    require.NotEmpty(t, queueURL)
}
