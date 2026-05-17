from pydantic_settings import BaseSettings, SettingsConfigDict

class ServerSettings(BaseSettings):
    redis_url: str = "redis://localhost:6379"
    database_url: str
    mpesa_consumer_key: str
    mpesa_consumer_secret: str
    mpesa_shortcode: str
    mpesa_password: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = ServerSettings()