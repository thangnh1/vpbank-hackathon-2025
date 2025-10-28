package terratest

import (
    "path/filepath"
    "testing"

    "github.com/gruntwork-io/terratest/modules/terraform"
    "github.com/stretchr/testify/require"
)

func TestNetworkModule(t *testing.T) {
    t.Parallel()

    terraformDir := filepath.Join("fixtures", "network")

    terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
        TerraformDir: terraformDir,
    })

    defer terraform.Destroy(t, terraformOptions)

    terraform.InitAndApply(t, terraformOptions)

    vpcID := terraform.Output(t, terraformOptions, "vpc_id")
    require.NotEmpty(t, vpcID)

    publicSubnets := terraform.OutputList(t, terraformOptions, "public_subnet_ids")
    require.Greater(t, len(publicSubnets), 0)
}
