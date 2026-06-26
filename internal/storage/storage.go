package storage

import (
	"context"
	"io"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Config struct {
	Endpoint        string
	AccessKeyID     string
	SecretAccessKey string
	Bucket          string
	Region          string
	UseSSL          bool
}

type Client struct {
	config Config
	minio  *minio.Client
}

func NewClient(config Config) (*Client, error) {
	if config.Endpoint == "" {
		return &Client{config: config}, nil
	}

	client, err := minio.New(config.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.AccessKeyID, config.SecretAccessKey, ""),
		Secure: config.UseSSL,
		Region: config.Region,
	})
	if err != nil {
		return nil, err
	}

	return &Client{
		config: config,
		minio:  client,
	}, nil
}

func (c *Client) Enabled() bool {
	return c != nil && c.minio != nil && c.config.Bucket != ""
}

func (c *Client) PutObject(ctx context.Context, key string, reader io.Reader, size int64, contentType string) error {
	if !c.Enabled() {
		return nil
	}

	_, err := c.minio.PutObject(ctx, c.config.Bucket, key, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	return err
}
